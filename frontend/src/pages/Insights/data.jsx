import axiosInstance from "../../axiosConfig";

export async function fetchStats() {
  try {
    const res = await axiosInstance.get("/api/tasks/stats");
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error("Error fetching stats:", err);
    throw err;
  }
}
