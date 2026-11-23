import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { App } from "supertest/types";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";

describe("TasksController", () => {
  let app: INestApplication<App>;
  const tasksService = {
    create: jest.fn((task: unknown) => Promise.resolve(task)),
    findAll: jest.fn(() => Promise.resolve([])),
    findById: jest.fn((id: string) => Promise.resolve({ id })),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: tasksService }],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("keeps task queries public", async () => {
    await request(app.getHttpServer()).get("/tasks").expect(200).expect([]);
    expect(tasksService.findAll).toHaveBeenCalledTimes(1);

    await request(app.getHttpServer())
      .get("/tasks/6af691f7ad6c0c0e2753eaf2")
      .expect(200)
      .expect({ id: "6af691f7ad6c0c0e2753eaf2" });
    expect(tasksService.findById).toHaveBeenCalledWith(
      "6af691f7ad6c0c0e2753eaf2",
    );
  });

  it("rejects task creation without the admin token", async () => {
    await request(app.getHttpServer())
      .post("/tasks")
      .send({
        title: "Revisión",
        userId: "6af691f7ad6c0c0e2753eaf2",
      })
      .expect(403);

    expect(tasksService.create).not.toHaveBeenCalled();
  });

  it("rejects unapproved task properties", async () => {
    await request(app.getHttpServer())
      .post("/tasks")
      .set("Authorization", "admin-secret-token")
      .send({
        title: "Revisión",
        userId: "6af691f7ad6c0c0e2753eaf2",
        isAdmin: true,
      })
      .expect(400);

    expect(tasksService.create).not.toHaveBeenCalled();
  });

  it("delegates authorized task creation to TasksService", async () => {
    const task = {
      title: "Revisión",
      userId: "6af691f7ad6c0c0e2753eaf2",
    };

    await request(app.getHttpServer())
      .post("/tasks")
      .set("Authorization", "admin-secret-token")
      .send(task)
      .expect(201)
      .expect(task);

    expect(tasksService.create).toHaveBeenCalledWith(task);
  });
});
