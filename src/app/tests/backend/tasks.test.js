import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "@/app/api/tasks/route";
import * as dbModule from "@/utils/dbConnections";
import { GET as GETid, PATCH, DELETE } from "@/app/api/tasks/[id]/route";

//mock request for POST
function mockReq(body) {
  return new Request("http://localhost/api/tasks", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

function mockReqGet(url = "http://localhost/api/tasks") {
  return new Request(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

//POST errors test - missing required field
describe("POST /api/tasks", () => {
  it("should reject empty title", async () => {
    const req = mockReq({
      title: "    ", //empty title
      due: "2026-04-10T14:30:00",
      status: "Ongoing",
      description: "lorem ipsum",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Title is required and cannot be empty");
  });
});

//POST catch error
describe("POST /api/tasks", () => {
  beforeEach(() => {
    vi.spyOn(dbModule.db, "query").mockImplementation(() => {
      throw new Error("DB failure");
    });
  });
  it("should catch error and return 500", async () => {
    const req = mockReq({
      title: "Test 1",
      due: "2026-04-10T14:30:00",
      status: "Ongoing",
      description: "lorem ipsum",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to create task");
  });
});

//POST task created.
describe("POST /api/tasks", () => {
  beforeEach(() => {
    vi.spyOn(dbModule.db, "query").mockImplementation(async () => ({
      rows: [
        {
          id: 1,
          title: "Test Task",
          status: "Ongoing",
          due: "2026-04-10T14:30:00Z",
          description: "lorem ipsum",
        },
      ],
    }));
  });
  it("creates a new task when all fields are valid", async () => {
    const req = mockReq({
      title: "Test Task",
      due: "2026-04-10T14:30:00Z",
      status: "Ongoing",
      description: "lorem ipsum",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(data.data.title).toBe("Test Task");
    expect(new Date(data.data.due).toISOString()).toBe(
      new Date("2026-04-10T14:30:00Z").toISOString(),
    );
    expect(data.data.status).toBe("Ongoing");
    expect(data.data.description).toBe("lorem ipsum");
  });
});

//GET returns tasks
describe("GET /api/tasks", () => {
  beforeEach(() => {
    vi.spyOn(dbModule.db, "query").mockResolvedValue({
      rows: [
        {
          id: 1,
          title: "Task 1",
          status: "Complete",
          due: "2026-04-10T14:30:00Z",
          description: "Test task",
        },
        {
          id: 2,
          title: "Task 2",
          status: "Ongoing",
          due: "2026-04-10T09:30:00Z",
          description: null,
        },
      ],
    });
  });
  it("Returns all tasks", async () => {
    const res = await GET(mockReqGet());
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.length).toBe(2);
    expect(data.data[0].title).toBe("Task 1");
    expect(data.data[1].status).toBe("Ongoing");
  });
});

//GET error
describe("GET /api/tasks", () => {
  beforeEach(() => {
    vi.spyOn(dbModule.db, "query").mockImplementation(() => {
      throw new Error("DB failure");
    });
  });
  it("Should catch error and return 500", async () => {
    const res = await GET(mockReqGet());
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Failed to fetch tasks");
  });
});

//GET test handles empty db
describe("GET /api/tasks", () => {
  beforeEach(() => {
    vi.spyOn(dbModule.db, "query").mockResolvedValue({
      rows: [],
    });
  });
  it("Returns true with an empty array", async () => {
    const res = await GET(mockReqGet());
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.length).toBe(0);
  });
});

//tests for routes requiring id

function mockParams(id) {
  return { params: { id } };
}

//Deletes a task when id provided
describe("DELETE /api/tasks/:id", () => {
  beforeEach(() => {
    vi.spyOn(dbModule.db, "query").mockResolvedValue({
      rows: [
        {
          id: 1,
          title: "Test task",
          status: "Ongoing",
          due: "2026-04-10T14:30:00Z",
          description: "lorem ipsum",
        },
      ],
    });
  });
  it("Deletes a task where valid id is provided", async () => {
    const req = new Request("http://localhost/api/tasks/1", {
      method: "DELETE",
    });
    const res = await DELETE(req, mockParams(1));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.id).toBe(1);
    expect(data.data.title).toBe("Test task");
  });
});

//DELETE- Catches error and returns 500
describe("DELETE /api/tasks/:id", () => {
  beforeEach(() => {
    vi.spyOn(dbModule.db, "query").mockImplementation(() => {
      throw new Error("DB failure");
    });
  });
  it("Deletes a task where valid id is provided", async () => {
    const req = new Request("http://localhost/api/tasks/1", {
      method: "DELETE",
    });
    const res = await DELETE(req, mockParams(1));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to delete task");
  });
});

//DELETE - handles task not found
describe("DELETE /api/tasks/:id", () => {
  beforeEach(() => {
    vi.spyOn(dbModule.db, "query").mockResolvedValue({
      rows: [],
    });
  });
  it("Returns task not found if result.rows.length === 0", async () => {
    const req = new Request("http://localhost/api/tasks/1", {
      method: "DELETE",
    });
    const res = await DELETE(req, mockParams(1));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Task not found");
  });
});

//GET with id, returns task
describe("GET /api/tasks/:id", () => {
  beforeEach(() => {
    vi.spyOn(dbModule.db, "query").mockResolvedValue({
      rows: [
        {
          id: 1,
          title: "Test task",
          status: "Ongoing",
          due: "2026-04-10T14:30:00Z",
          description: "lorem ipsum",
        },
      ],
    });
  });
  it("Returns a task", async () => {
    const req = new Request("http://localhost/api/tasks/1", {
      method: "GET",
    });
    const res = await GETid(req, mockParams(1));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.id).toBe(1);
    expect(data.data.title).toBe("Test task");
  });
});

//Get with id -catches error and returns 500
describe("GET /api/tasks/:id", () => {
  beforeEach(() => {
    vi.spyOn(dbModule.db, "query").mockImplementation(() => {
      throw new Error("DB failure");
    });
  });
  it("Should catch error and return 500", async () => {
    const req = new Request("http://localhost/api/tasks/1", {
      method: "GET",
    });
    const res = await GETid(req, mockParams(1));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Failed to fetch task");
  });
});

// GET by id - if no task with id found
describe("GET /api/tasks/:id", () => {
  beforeEach(() => {
    vi.spyOn(dbModule.db, "query").mockResolvedValue({
      rows: [],
    });
  });
  it("Returns 404 and task not found", async () => {
    const req = new Request("http://localhost/api/tasks/1", {
      method: "GET",
    });
    const res = await GETid(req, mockParams(1));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Task not found");
  });
});

function mockReqPatch(body) {
  return new Request("http://localhost/api/tasks/1", {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

//PATCH success for full edit
describe("PATCH /api/tasks/:id", () => {
  beforeEach(() => {
    vi.spyOn(dbModule.db, "query").mockResolvedValue({
      rows: [
        {
          title: "Test task",
          due: "2026-04-10T14:30:00",
          status: "Ongoing",
          description: "lorem ipsum",
        },
      ],
    });
  });
  it("Returns 200 and updated task", async () => {
    const req = mockReqPatch({
      title: "Test task",
      due: "2026-04-10T14:30:00",
      status: "Ongoing",
      description: "lorem ipsum",
    });
    const res = await PATCH(req, mockParams(1));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.title).toBe("Test task");
  });
});

//PATCH success for status only
describe("PATCH /api/tasks/:id", () => {
  beforeEach(() => {
    vi.spyOn(dbModule.db, "query").mockResolvedValue({
      rows: [{ status: "Ongoing" }],
    });
  });
  it("Returns 200 and updated status", async () => {
    const req = mockReqPatch({ status: "Ongoing" });
    const res = await PATCH(req, mockParams(1));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.status).toBe("Ongoing");
  });
});

//PATCH failed to find task
describe("PATCH /api/tasks/:id", () => {
  beforeEach(() => {
    vi.spyOn(dbModule.db, "query").mockResolvedValue({
      rows: [],
    });
  });
  it("Returns 404 and task not found", async () => {
    const req = mockReqPatch({ status: "Ongoing" });
    const res = await PATCH(req, mockParams(1));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Task not found");
  });
});

//PATCH invalid status
describe("PATCH /api/tasks/:id", () => {
  beforeEach(() => {
    vi.spyOn(dbModule.db, "query").mockResolvedValue({
      rows: [{ status: "test" }],
    });
  });
  it("Returns 400 and Invalid status value as error message", async () => {
    const req = mockReqPatch({ status: "test" });
    const res = await PATCH(req, mockParams(1));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Invalid status value");
  });
});

//PATCH empty title
describe("PATCH /api/tasks/:id", () => {
  beforeEach(() => {
    vi.spyOn(dbModule.db, "query").mockResolvedValue({
      rows: [
        {
          title: "    ", //empty title
          due: "2026-04-10T14:30:00",
          status: "Ongoing",
          description: "lorem ipsum",
        },
      ],
    });
  });
  it("Returns 400 and Title cannot be empty as error message", async () => {
    const req = mockReqPatch({
      title: "    ", //empty title
      due: "2026-04-10T14:30:00",
      status: "Ongoing",
      description: "lorem ipsum",
    });
    const res = await PATCH(req, mockParams(1));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Title cannot be empty");
  });
});

//PATCH no fields
describe("PATCH /api/tasks/:id", () => {
  beforeEach(() => {
    vi.spyOn(dbModule.db, "query").mockResolvedValue({
      rows: [],
    });
  });
  it("Returns 400 and No fields to update error message", async () => {
    const req = mockReqPatch({});
    const res = await PATCH(req, mockParams(1));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("No fields to update");
  });
});

//PATCH DB failure
describe("PATCH /api/tasks/:id", () => {
  beforeEach(() => {
    vi.spyOn(dbModule.db, "query").mockImplementation(() => {
      throw new Error("DB failure");
    });
  });
  it("Returns 500 and Failed to update task as error message", async () => {
    const req = mockReqPatch({ status: "Ongoing" });
    const res = await PATCH(req, mockParams(1));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to update task");
  });
});
