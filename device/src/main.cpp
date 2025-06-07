#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_BME280.h>
#include <ArduinoOTA.h>
#include <esp_task_wdt.h>

// Pin definitions
#define SDA_PIN 21
#define SCL_PIN 22
#define LED_PIN 2
#define PRESSURE_SENSOR_PIN A0  // Analog pin for SDP810 (if using analog output)

// Configuration
const char* ssid = WIFI_SSID;
const char* password = WIFI_PASSWORD;
const char* mqtt_server = MQTT_SERVER;
const int mqtt_port = MQTT_PORT;

// Device identification
const char* device_id = "hvac-esp32-001";
const char* device_name = "Living Room Sensor";
const char* firmware_version = "1.0.0";

// MQTT topics
const char* telemetry_topic = "hvac/devices/hvac-esp32-001/telemetry";
const char* status_topic = "hvac/devices/hvac-esp32-001/status";
const char* command_topic = "hvac/devices/hvac-esp32-001/commands";
const char* alert_topic = "hvac/devices/hvac-esp32-001/alerts";

// Timing constants
const unsigned long SENSOR_READ_INTERVAL = 30000;  // 30 seconds
const unsigned long HEARTBEAT_INTERVAL = 60000;    // 1 minute
const unsigned long WIFI_TIMEOUT = 10000;          // 10 seconds
const unsigned long MQTT_RECONNECT_INTERVAL = 5000; // 5 seconds

// Global objects
WiFiClient espClient;
PubSubClient mqtt_client(espClient);
Adafruit_BME280 bme;

// Global variables
unsigned long last_sensor_read = 0;
unsigned long last_heartbeat = 0;
unsigned long last_mqtt_attempt = 0;
bool sensor_initialized = false;
float temperature = 0.0;
float humidity = 0.0;
float pressure = 0.0;
float pressure_differential = 0.0;
int wifi_signal_strength = 0;
unsigned long uptime_seconds = 0;

// Function prototypes
void setup_wifi();
void setup_mqtt();
void setup_sensors();
void setup_ota();
void read_sensors();
void publish_telemetry();
void publish_status();
void publish_alert(const char* alert_type, const char* message);
void handle_mqtt_message(char* topic, byte* payload, unsigned int length);
void reconnect_mqtt();
void blink_led(int count, int delay_ms = 200);
float read_pressure_sensor();

void setup() {
    Serial.begin(115200);
    delay(1000);
    
    Serial.println("\n=== HVAC ESP32 Sensor Starting ===");
    Serial.printf("Device ID: %s\n", device_id);
    Serial.printf("Firmware: %s\n", firmware_version);
    
    // Initialize LED
    pinMode(LED_PIN, OUTPUT);
    digitalWrite(LED_PIN, LOW);
    
    // Initialize I2C
    Wire.begin(SDA_PIN, SCL_PIN);
    
    // Setup components
    setup_wifi();
    setup_sensors();
    setup_mqtt();
    setup_ota();
    
    // Enable watchdog timer
    esp_task_wdt_init(30, true);
    esp_task_wdt_add(NULL);
    
    // Initial sensor reading
    read_sensors();
    publish_status();
    
    Serial.println("=== Setup Complete ===\n");
    blink_led(3, 500);
}

void loop() {
    unsigned long current_time = millis();
    uptime_seconds = current_time / 1000;
    
    // Handle OTA updates
    ArduinoOTA.handle();
    
    // Maintain MQTT connection
    if (!mqtt_client.connected()) {
        if (current_time - last_mqtt_attempt > MQTT_RECONNECT_INTERVAL) {
            reconnect_mqtt();
            last_mqtt_attempt = current_time;
        }
    } else {
        mqtt_client.loop();
    }
    
    // Read sensors periodically
    if (current_time - last_sensor_read > SENSOR_READ_INTERVAL) {
        read_sensors();
        if (mqtt_client.connected()) {
            publish_telemetry();
        }
        last_sensor_read = current_time;
    }
    
    // Send heartbeat
    if (current_time - last_heartbeat > HEARTBEAT_INTERVAL) {
        if (mqtt_client.connected()) {
            publish_status();
        }
        last_heartbeat = current_time;
    }
    
    // Feed watchdog
    esp_task_wdt_reset();
    
    // Short delay to prevent tight loop
    delay(100);
}

void setup_wifi() {
    Serial.print("Connecting to WiFi");
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    
    unsigned long start_time = millis();
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
        
        if (millis() - start_time > WIFI_TIMEOUT) {
            Serial.println("\nWiFi connection timeout! Restarting...");
            ESP.restart();
        }
    }
    
    Serial.println();
    Serial.printf("WiFi connected! IP: %s\n", WiFi.localIP().toString().c_str());
    Serial.printf("Signal strength: %d dBm\n", WiFi.RSSI());
    
    wifi_signal_strength = WiFi.RSSI();
}

void setup_sensors() {
    Serial.print("Initializing BME280 sensor...");
    
    if (!bme.begin(0x76)) {  // Try primary I2C address
        if (!bme.begin(0x77)) {  // Try secondary I2C address
            Serial.println(" FAILED!");
            publish_alert("sensor_error", "BME280 sensor initialization failed");
            sensor_initialized = false;
            return;
        }
    }
    
    // Configure BME280 settings
    bme.setSampling(Adafruit_BME280::MODE_NORMAL,
                    Adafruit_BME280::SAMPLING_X2,  // temperature
                    Adafruit_BME280::SAMPLING_X2,  // pressure
                    Adafruit_BME280::SAMPLING_X2,  // humidity
                    Adafruit_BME280::FILTER_X16,
                    Adafruit_BME280::STANDBY_MS_500);
    
    sensor_initialized = true;
    Serial.println(" SUCCESS!");
}

void setup_mqtt() {
    mqtt_client.setServer(mqtt_server, mqtt_port);
    mqtt_client.setCallback(handle_mqtt_message);
    mqtt_client.setKeepAlive(60);
    mqtt_client.setSocketTimeout(10);
    
    Serial.printf("MQTT server: %s:%d\n", mqtt_server, mqtt_port);
}

void setup_ota() {
    ArduinoOTA.setHostname(device_id);
    ArduinoOTA.setPassword("hvac-ota-2023");
    
    ArduinoOTA.onStart([]() {
        String type = (ArduinoOTA.getCommand() == U_FLASH) ? "sketch" : "filesystem";
        Serial.println("OTA Update Start: " + type);
        publish_alert("ota_start", "Firmware update starting");
    });
    
    ArduinoOTA.onEnd([]() {
        Serial.println("\nOTA Update Complete");
        publish_alert("ota_complete", "Firmware update completed");
    });
    
    ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
        Serial.printf("OTA Progress: %u%%\r", (progress / (total / 100)));
    });
    
    ArduinoOTA.onError([](ota_error_t error) {
        Serial.printf("OTA Error[%u]: ", error);
        String error_msg = "Unknown OTA error";
        
        if (error == OTA_AUTH_ERROR) error_msg = "Auth Failed";
        else if (error == OTA_BEGIN_ERROR) error_msg = "Begin Failed";
        else if (error == OTA_CONNECT_ERROR) error_msg = "Connect Failed";
        else if (error == OTA_RECEIVE_ERROR) error_msg = "Receive Failed";
        else if (error == OTA_END_ERROR) error_msg = "End Failed";
        
        Serial.println(error_msg);
        publish_alert("ota_error", error_msg.c_str());
    });
    
    ArduinoOTA.begin();
    Serial.println("OTA Ready");
}

void read_sensors() {
    if (!sensor_initialized) {
        Serial.println("Sensors not initialized, skipping reading");
        return;
    }
    
    // Read BME280 sensors
    temperature = bme.readTemperature();
    humidity = bme.readHumidity();
    pressure = bme.readPressure();
    
    // Read pressure differential (SDP810 simulation)
    pressure_differential = read_pressure_sensor();
    
    // Update WiFi signal strength
    wifi_signal_strength = WiFi.RSSI();
    
    // Log readings
    Serial.printf("Sensor readings - Temp: %.2f°C, Humidity: %.2f%%, Pressure: %.2f Pa, Diff: %.2f Pa\n",
                  temperature, humidity, pressure, pressure_differential);
    
    // Check for anomalies
    if (temperature < -40 || temperature > 85) {
        publish_alert("temperature_anomaly", "Temperature reading out of normal range");
    }
    
    if (humidity < 0 || humidity > 100) {
        publish_alert("humidity_anomaly", "Humidity reading out of normal range");
    }
    
    // Blink LED to indicate successful reading
    digitalWrite(LED_PIN, HIGH);
    delay(50);
    digitalWrite(LED_PIN, LOW);
}

float read_pressure_sensor() {
    // Simulate SDP810 pressure sensor reading
    // In real implementation, this would interface with the actual sensor
    int analog_reading = analogRead(PRESSURE_SENSOR_PIN);
    
    // Convert analog reading to pressure differential
    // SDP810 range: ±500 Pa, assuming 3.3V reference
    float voltage = (analog_reading / 4095.0) * 3.3;
    float pressure_pa = (voltage - 1.65) * (500.0 / 1.65);  // Convert to Pa
    
    return pressure_pa;
}

void publish_telemetry() {
    StaticJsonDocument<512> telemetry;
    
    telemetry["deviceId"] = device_id;
    telemetry["timestamp"] = millis();
    
    JsonObject sensors = telemetry.createNestedObject("sensors");
    sensors["temperature"] = round(temperature * 100) / 100.0;  // Round to 2 decimal places
    sensors["humidity"] = round(humidity * 100) / 100.0;
    sensors["pressure"] = round(pressure * 100) / 100.0;
    sensors["pressureDifferential"] = round(pressure_differential * 100) / 100.0;
    
    telemetry["battery"] = 100;  // Simulated battery level
    telemetry["rssi"] = wifi_signal_strength;
    telemetry["firmware"] = firmware_version;
    telemetry["uptime"] = uptime_seconds;
    
    char buffer[512];
    serializeJson(telemetry, buffer);
    
    if (mqtt_client.publish(telemetry_topic, buffer, true)) {
        Serial.println("Telemetry published successfully");
    } else {
        Serial.println("Failed to publish telemetry");
    }
}

void publish_status() {
    StaticJsonDocument<256> status;
    
    status["deviceId"] = device_id;
    status["status"] = sensor_initialized ? "online" : "error";
    status["timestamp"] = millis();
    status["uptime"] = uptime_seconds;
    status["freeHeap"] = ESP.getFreeHeap();
    status["wifiRssi"] = wifi_signal_strength;
    
    char buffer[256];
    serializeJson(status, buffer);
    
    mqtt_client.publish(status_topic, buffer, true);
}

void publish_alert(const char* alert_type, const char* message) {
    StaticJsonDocument<256> alert;
    
    alert["deviceId"] = device_id;
    alert["type"] = alert_type;
    alert["message"] = message;
    alert["timestamp"] = millis();
    alert["severity"] = "medium";
    
    char buffer[256];
    serializeJson(alert, buffer);
    
    mqtt_client.publish(alert_topic, buffer);
    Serial.printf("Alert published: %s - %s\n", alert_type, message);
}

void handle_mqtt_message(char* topic, byte* payload, unsigned int length) {
    // Convert payload to string
    char message[length + 1];
    memcpy(message, payload, length);
    message[length] = '\0';
    
    Serial.printf("MQTT message received [%s]: %s\n", topic, message);
    
    // Parse JSON command
    StaticJsonDocument<256> command;
    DeserializationError error = deserializeJson(command, message);
    
    if (error) {
        Serial.println("Failed to parse command JSON");
        return;
    }
    
    const char* cmd_type = command["type"];
    
    if (strcmp(cmd_type, "status_request") == 0) {
        publish_status();
    } else if (strcmp(cmd_type, "calibrate") == 0) {
        // Handle sensor calibration
        Serial.println("Calibration command received");
        publish_status();
    } else if (strcmp(cmd_type, "ota_update") == 0) {
        const char* firmware_url = command["firmwareUrl"];
        Serial.printf("OTA update requested: %s\n", firmware_url);
        // OTA update would be handled by ArduinoOTA
    } else {
        Serial.printf("Unknown command type: %s\n", cmd_type);
    }
}

void reconnect_mqtt() {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi disconnected, attempting reconnection...");
        setup_wifi();
        return;
    }
    
    Serial.print("Attempting MQTT connection...");
    
    String client_id = String(device_id) + "-" + String(random(0xffff), HEX);
    
    if (mqtt_client.connect(client_id.c_str())) {
        Serial.println(" connected!");
        
        // Subscribe to command topic
        mqtt_client.subscribe(command_topic);
        Serial.printf("Subscribed to: %s\n", command_topic);
        
        // Publish online status
        publish_status();
        
    } else {
        Serial.printf(" failed, rc=%d\n", mqtt_client.state());
    }
}

void blink_led(int count, int delay_ms) {
    for (int i = 0; i < count; i++) {
        digitalWrite(LED_PIN, HIGH);
        delay(delay_ms);
        digitalWrite(LED_PIN, LOW);
        if (i < count - 1) delay(delay_ms);
    }
} 