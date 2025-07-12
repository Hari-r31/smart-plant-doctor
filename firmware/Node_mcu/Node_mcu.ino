#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <DHT.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "Hari";
const char* password = "12345678";

// Supabase API Info
const char* host = "mzoqcldcrokbeyceysfr.supabase.co";
const int httpsPort = 443;
const char* supabase_url = "/rest/v1/sensor_data";
const char* supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16b3FjbGRjcm9rYmV5Y2V5c2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMzU3NTEsImV4cCI6MjA2MzkxMTc1MX0.MlW-UMKZw4DusY2QDKEA_BiOvgSJ0ddoq6J7mSBLKeQ";

// Sensor Pins
#define SOIL_PIN A0
#define DHTPIN D4
#define DHTTYPE DHT11
#define LDR_PIN D5

DHT dht(DHTPIN, DHTTYPE);
WiFiClientSecure client;

void setup() {
  Serial.begin(115200);
  dht.begin();
  pinMode(SOIL_PIN, INPUT);
  pinMode(LDR_PIN, INPUT);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\n✅ Connected to WiFi");

  client.setInsecure();  // Bypass certificate check
}

void loop() {
  // Read sensors
  int soilVal = analogRead(SOIL_PIN);
  float temp = dht.readTemperature();
  float humi = dht.readHumidity();
  int lightRaw = digitalRead(LDR_PIN);

  String soilStatus = (soilVal < 400) ? "Wet" : (soilVal < 800 ? "Moist" : "Dry");
  String lightStatus = (lightRaw == HIGH) ? "Dark" : "Bright";

  // Check if readings are valid
  if (isnan(temp) || isnan(humi)) {
    Serial.println("❌ Failed to read from DHT11 sensor!");
    delay(2000);
    return;
  }

  // Create JSON payload
  StaticJsonDocument<256> doc;
  doc["soil_value"] = soilVal;
  doc["soil_status"] = soilStatus;
  doc["temperature"] = temp;
  doc["humidity"] = humi;
  doc["light_status"] = lightStatus;

  String payload;
  serializeJson(doc, payload);

  // Connect to Supabase
  if (!client.connect(host, httpsPort)) {
    Serial.println("❌ Connection to Supabase failed");
    return;
  }

  // Send HTTP POST request
  client.println("POST " + String(supabase_url) + " HTTP/1.1");
  client.println("Host: " + String(host));
  client.println("Content-Type: application/json");
  client.println("apikey: " + String(supabase_key));
  client.println("Authorization: Bearer " + String(supabase_key));
  client.println("Content-Length: " + String(payload.length()));
  client.println();
  client.println(payload);

  // Wait for response
  while (client.connected()) {
    String line = client.readStringUntil('\n');
    if (line == "\r") break;
  }

  Serial.println("✅ Data sent to Supabase:");
  Serial.println(payload);

  delay(10000);  // Send every 10 seconds (adjust as needed)
}
