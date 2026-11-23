import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { Task } from "./schemas/task.schema";
import { TasksService } from "./tasks.service";
import { UsersService } from "../users/users.service";

describe("TasksService", () => {
  let tasksService: TasksService;
  const userId = "6af691f7ad6c0c0e2753eaf2";
  const task = { title: "Revisión", userId };
  const usersService = {
    findById: jest.fn().mockResolvedValue({ _id: userId }),
  };
  const taskModel = {
    create: jest.fn().mockResolvedValue(task),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getModelToken(Task.name), useValue: taskModel },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    tasksService = moduleFixture.get<TasksService>(TasksService);
    jest.clearAllMocks();
    usersService.findById.mockResolvedValue({ _id: userId });
    taskModel.create.mockResolvedValue(task);
  });

  it("verifies the user and persists a new task", async () => {
    await expect(tasksService.create(task)).resolves.toBe(task);

    expect(usersService.findById).toHaveBeenCalledWith(userId);
    expect(taskModel.create).toHaveBeenCalledWith(task);
  });
});
