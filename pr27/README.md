# Практика 27. RabbitMQ message queue

Тематический проект для практического задания по брокерам сообщений.

## Что реализовано

- Express API с маршрутом `POST /tasks`.
- RabbitMQ topology с основной очередью и Dead Letter Queue.
- Consumer-воркер с обработкой задач и логированием.
- Retry logic с экспоненциальной задержкой.
- Запуск двух воркеров одновременно через launcher.

## Запуск

1. Установите зависимости:

```bash
pnpm install
```

2. Поднимите RabbitMQ:

```bash
docker compose up -d
```

3. Запустите API:

```bash
pnpm run api
```

4. Запустите два воркера:

```bash
pnpm run workers
```

## Пример запроса

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email",
    "payload": {
      "to": "user@example.com",
      "subject": "Welcome",
      "body": "Thanks for registering"
    },
    "simulation": {
      "processingMs": 1500,
      "failForAttempts": 1
    }
  }'
```

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/tasks -ContentType "application/json" -Body '{"type":"email","payload":{"to":"user@example.com","subject":"Welcome","body":"Thanks for registering"},"simulation":{"processingMs":1500,"failForAttempts":1}}'
```

Поле `simulation` помогает проверить retry и DLQ в демонстрации. Если `failForAttempts` равно `2`, задача успешно выполнится только на третьей попытке.

## Проверка DLQ

Чтобы отправить задачу в DLQ, задайте `failForAttempts` больше либо равным `MAX_TASK_ATTEMPTS`.

## Сборка

```bash
pnpm run build
```
