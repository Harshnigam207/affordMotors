"use server";
import { getDB } from "../utils/db";
import { ObjectId } from "mongodb";

export async function fetchEmployeeTasks(id, pageno) {
  try {
    const db = await getDB();
    const tasksCollection = db.collection("employee_tasks");

    pageno = parseInt(pageno);
    if (pageno <= 0) {
      pageno = 1;
    }
    const taskCount = await tasksCollection.countDocuments({ user_id: id, cancelled: { $ne: true }, completed: { $ne: true } });
    const totalPages = Math.ceil(taskCount / 12);
    if (pageno > totalPages) {
      pageno = totalPages;
    }

    let tasks;
    if (pageno === 1) {
      tasks = await tasksCollection
        .find({ user_id: id, cancelled: { $ne: true }, completed: { $ne: true } })
        .limit(12)
        .toArray();
    } else {
      pageno = (pageno - 1) * 12;
      tasks = await tasksCollection
        .find({ user_id: id, cancelled: { $ne: true }, completed: { $ne: true } })
        .skip(pageno)
        .limit(12)
        .toArray();
    }

    // Convert _id to string before returning to the client
    const tasksWithStringId = tasks.map((task) => {
      return {
        ...task,
        _id: task._id.toString(), // Convert ObjectId to string
      };
    });

    return tasksWithStringId;
  } catch (err) {
    console.error("Error in Fetching Employee Tasks:", err);
  }
}

export async function paginationDetails(id, pageno) {
  try {
    const db = await getDB();
    const tasksCollection = db.collection("employee_tasks");

    pageno = parseInt(pageno);
    if (pageno <= 0) {
      pageno = 1;
    }
    const taskCount = await tasksCollection.countDocuments({ user_id: id, cancelled: { $ne: true }, completed: { $ne: true } });
    const totalPages = Math.ceil(taskCount / 12);
    if (pageno > totalPages) {
      pageno = totalPages;
    }

    if (pageno === 1) {
      return [
        { index_number: 1, color: "#9129ac", cursor: "pointer", value: 1 },
        { index_number: 2, color: "var(--dark-gray)", cursor: "pointer", value: 2 },
        { index_number: 3, color: "var(--dark-gray)", cursor: "pointer", value: 3 },
        { index_number: 4, color: "var(--dark-gray)", cursor: "auto", value: "..." },
        { index_number: 5, color: "var(--dark-gray)", cursor: "pointer", value: totalPages },
      ];
    } else if (pageno === totalPages) {
      return [
        { index_number: 1, color: "var(--dark-gray)", cursor: "pointer", value: 1 },
        { index_number: 2, color: "var(--dark-gray)", cursor: "auto", value: "..." },
        { index_number: 3, color: "var(--dark-gray)", cursor: "pointer", value: pageno - 2 },
        { index_number: 4, color: "var(--dark-gray)", cursor: "pointer", value: pageno - 1 },
        { index_number: 5, color: "#9129ac", cursor: "pointer", value: pageno },
      ];
    } else if (pageno === totalPages - 1) {
      return [
        { index_number: 1, color: "var(--dark-gray)", cursor: "pointer", value: 1 },
        { index_number: 2, color: "var(--dark-gray)", cursor: "auto", value: "..." },
        { index_number: 3, color: "var(--dark-gray)", cursor: "pointer", value: pageno - 1 },
        { index_number: 4, color: "#9129ac", cursor: "pointer", value: pageno },
        { index_number: 5, color: "var(--dark-gray)", cursor: "pointer", value: pageno + 1 },
      ];
    } else {
      return [
        { index_number: 1, color: "var(--dark-gray)", cursor: "pointer", value: pageno - 1 },
        { index_number: 2, color: "#9129ac", cursor: "pointer", value: pageno },
        { index_number: 3, color: "var(--dark-gray)", cursor: "pointer", value: pageno + 1 },
        { index_number: 4, color: "var(--dark-gray)", cursor: "auto", value: "..." },
        { index_number: 5, color: "var(--dark-gray)", cursor: "pointer", value: totalPages },
      ];
    }
  } catch (err) {
    console.error("Error in Pagination Details:", err);
  }
}

export async function cancelTask(id) {
  try {
    const db = await getDB();
    const tasksCollection = db.collection("employee_tasks");

    const result = await tasksCollection.updateOne({ _id: new ObjectId(id) }, { $set: { cancelled: true } });
    console.log(result);

    if (result.matchedCount === 0) {
      return { success: false, message: "Task not found." };
    }
    return { success: true, message: "Cancel Task Completed." };
  } catch (err) {
    return { success: false, message: err.message || "An error occurred" };
  }
}

export async function MarkVehicleTask(id, data) {
  try {
    const db = await getDB();
    const tasksCollection = db.collection("employee_tasks");

    // Attempt to update the task
    const result = await tasksCollection.updateOne({ _id: new ObjectId(id) }, { $set: { ...data } });
    console.log(result);

    if (result.matchedCount === 0) {
      return { success: false, message: "Task not found." };
    }
    return { success: true, message: "Mark Vehicle Task Completed." };
  } catch (err) {
    return { success: false, message: err.message || "An error occurred" };
  }
}

export async function searchTasks(searchValue) {
  try {
    const db = await getDB();
    const tasksCollection = db.collection("employee_tasks");

    // Ensure searchValue is in uppercase for case-insensitive comparison
    const normalizedSearchValue = searchValue.toUpperCase();

    // Use a regular expression that matches the start of the string
    const query = {
      registration_no: { $regex: `^${normalizedSearchValue}`, $options: "i" }, // Optimized regex: matches the start of the string
      cancelled: { $ne: true },
      completed: { $ne: true },
    };

    // Use projection to limit returned fields, only fetching necessary fields
    const tasks = await tasksCollection
      .find(query, { projection: { _id: 1, registration_no: 1 } }) // Only returning necessary fields
      .limit(12)
      .toArray();

    // Convert ObjectId to string for proper handling on the frontend
    const tasksWithStringId = tasks.map((task) => ({
      ...task,
      _id: task._id.toString(),
    }));

    return tasksWithStringId;
  } catch (err) {
    console.error("Error in Fetching Employee Tasks:", err);
  }
}

export async function taskOverallDetails(id) {
  try {
    const db = await getDB();
    const tasksCollection = db.collection("employee_tasks");

    const OverallCount = await tasksCollection.countDocuments({ user_id: id, cancelled: { $ne: true }, completed: { $ne: true } });
    const CompletedCount = await tasksCollection.countDocuments({ user_id: id, completed: true });
    const CancelledCount = await tasksCollection.countDocuments({ user_id: id, cancelled: true });

    return [
      { no: 1, heading: OverallCount, description: "Total Tasks", value: `decline by 3%`, img: "/assets/user_dashboard/tasks_icon.png", alt: "tasksimg", class: "piece1", color: "#fd9a1e" },
      { no: 2, heading: CancelledCount, description: "Cancelled Tasks", img: "/assets/user_dashboard/cancel_icon.png", alt: "cancelledimg", class: "piece1", color: "#e83e3b" },
      { no: 3, heading: CompletedCount, description: "Completed Tasks", img: "/assets/user_dashboard/recovered_icon.png", alt: "recoveredimg", class: "piece1", color: "#4aa34d" },
    ];
  } catch (err) {
    console.error("Error in Fetching Employee Tasks:", err);
    return [
      { no: 1, heading: 0, description: "Total Tasks", value: "none", img: "/assets/user_dashboard/tasks_icon.png", alt: "tasksimg", class: "piece1", color: "#fd9a1e" },
      { no: 2, heading: 0, description: "Cancelled Tasks", img: "/assets/user_dashboard/cancel_icon.png", alt: "cancelledimg", class: "piece1", color: "#e83e3b" },
      { no: 3, heading: 0, description: "Completed Tasks", img: "/assets/user_dashboard/recovered_icon.png", alt: "recoveredimg", class: "piece1", color: "#4aa34d" },
    ];
  }
}
