# Script: build User-Doctor Interaction Matrix từ Appointment Service.
import asyncio
import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix, save_npz
import joblib
import httpx
import os


async def build_interaction_matrix():
    """Lấy data từ Appointment Service và build ma trận tương tác"""

    # 1. Lấy lịch sử appointment từ Appointment Service
    print("📡 Fetching appointments from Appointment Service...")
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "http://appointment-service:8084/api/v1/appointments/all",
                headers={"X-Service-Token": "internal-token"},
                timeout=30.0
            )
            appointments = resp.json()
    except Exception as e:
        print(f"❌ Không thể kết nối Appointment Service: {e}")
        print("   Tạo sample data để test...")
        # Sample data cho development
        appointments = [
            {"patientId": 1, "doctorId": 101, "status": "COMPLETED"},
            {"patientId": 1, "doctorId": 102, "status": "COMPLETED"},
            {"patientId": 2, "doctorId": 101, "status": "COMPLETED"},
            {"patientId": 2, "doctorId": 103, "status": "COMPLETED"},
            {"patientId": 3, "doctorId": 102, "status": "COMPLETED"},
        ]

    df = pd.DataFrame(appointments)

    # Chỉ lấy appointments đã COMPLETED (đã thực sự khám)
    df = df[df["status"] == "COMPLETED"]
    print(f"📊 COMPLETED appointments: {len(df)}")

    # 2. Tính implicit rating:
    #    - Hoàn thành khám: base score 3
    #    - Có review + rating: + (rating - 3) * 0.5
    #    - Đặt lại với cùng bác sĩ: + 1 (trung thành)
    df["implicit_rating"] = 3.0

    # 3. Build sparse matrix
    users   = df["patientId"].unique().tolist()
    doctors = df["doctorId"].unique().tolist()

    user_idx   = {uid: i for i, uid in enumerate(users)}
    doctor_idx = {did: i for i, did in enumerate(doctors)}

    rows = [user_idx[uid] for uid in df["patientId"]]
    cols = [doctor_idx[did] for did in df["doctorId"]]
    vals = df["implicit_rating"].values

    matrix = csr_matrix(
        (vals, (rows, cols)),
        shape=(len(users), len(doctors))
    )

    density = matrix.nnz / (matrix.shape[0] * matrix.shape[1])
    print(f"Matrix shape: {matrix.shape}, density: {density:.4f}")

    # 4. Lưu matrix và metadata
    os.makedirs("app/models", exist_ok=True)
    save_npz("app/models/recommender_matrix.npz", matrix)
    joblib.dump(
        {"user_ids": users, "doctor_ids": doctors},
        "app/models/recommender_meta.pkl"
    )
    print("✅ Recommender matrix saved")


if __name__ == "__main__":
    asyncio.run(build_interaction_matrix())
