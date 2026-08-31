import unittest
from fastapi.testclient import TestClient
from main import app
from ml_engine import calculate_landslide_risk

class TestLandGuardAI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_ml_engine_calculations(self):
        # Test low risk calculation
        risk_score, level, fos, contribs, conf, summary, rec, chain, metrics = calculate_landslide_risk(
            rainfall=15.0,
            soil_moisture=20.0,
            slope=15.0,
            pore_pressure=10.0,
            vegetation_cover=80.0
        )
        self.assertEqual(level, "LOW")
        self.assertGreater(fos, 1.5)
        self.assertIn("Rainfall", contribs)

        # Test critical risk calculation
        risk_score_crit, level_crit, fos_crit, _, _, _, _, _, _ = calculate_landslide_risk(
            rainfall=220.0,
            soil_moisture=95.0,
            slope=45.0,
            pore_pressure=120.0,
            vegetation_cover=20.0
        )
        self.assertEqual(level_crit, "CRITICAL")
        self.assertLess(fos_crit, 1.2)

    def test_health_endpoint(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "ok")
        self.assertEqual(data["version"], "2.0.0")

    def test_predict_endpoint(self):
        payload = {
            "rainfall_mm": 142.0,
            "soil_moisture_pct": 78.0,
            "slope_deg": 36.0,
            "vegetation_cover_pct": 60.0
        }
        response = self.client.post("/api/predict", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("overall_risk_pct", data)
        self.assertIn("risk_level", data)
        self.assertIn("factor_of_safety", data)
        self.assertIn("contributors", data)

    def test_zones_endpoint(self):
        response = self.client.get("/api/zones")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreater(data["count"], 0)
        self.assertIn("zones", data)

    def test_history_endpoint(self):
        response = self.client.get("/api/history")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("history", data)

    def test_alerts_endpoint(self):
        response = self.client.get("/api/alerts")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("alerts", data)

    def test_stations_endpoint(self):
        response = self.client.get("/api/stations")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("stations", data)

    def test_export_report_endpoint(self):
        payload = {
            "zone_name": "Gangtok North Ridge",
            "risk_pct": 74,
            "risk_level": "HIGH",
            "factor_of_safety": 1.15,
            "rainfall_mm": 142.0,
            "soil_moisture_pct": 78.0,
            "slope_deg": 36.0
        }
        response = self.client.post("/api/export-report", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("report_id", data)


if __name__ == "__main__":
    unittest.main()
