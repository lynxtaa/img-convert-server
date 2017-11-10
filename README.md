# Конвертер изображений
Img Convert Server (ICS)

Общее описание
--------
Сервер предоставляет API-метод для конвертации изображений.

Установка
--------
Перед началом работы нужно установить все зависимости, необходимые для работы, и описанные в файле *package.json*:
```
npm install
```

API-методы
--------
- `POST /graph` Принимает JSON с настройками для cytoscape через body

    В ответе возвращает объект `{ base64: <String> }`, содержащий изображение в формате base64.

- `POST /:format[?query]` Принимает одно или несколько изображений в формате multipart/form-data

    * `format` *`<string>`* целевой формат, в который будет происходить конвертация
    * `query` *`<string>`* опции конвертации передаются в query-строке

    В ответе возвращает объект `{ name, data }`, содержащий пары ключ-значение, где
    `name` -- имя исходного файла, `data` -- сконвертированный файл в формате base64.
