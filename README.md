## Что это?
Инструмент для автоматического создания мок-сервера: имитации реального API,
описанного по спецификации [Open API v3](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md).

## Зависимости
- node.js >= 9
- Open API спецификация (yaml/json)

## Установка и запуск
- `npm i @m3-moretv/smogger`
- `npx @m3-moretv/smogger -s ./spec.yaml`
- `npx @m3-moretv/smogger --help` покажет список опций

На порту `:3000` запустится http сервер, который будет полностью эмулировать
описанное в спеке API. Все endpoints будут возвращать модели, описанные в 
спецификации с рандомными значениями, сгенеренными с помощью [Faker.js](https://github.com/marak/Faker.js/)

**Например эта схема:**
```yaml
type: object
required:
    - id
    - name
properties:
  id:
    type: integer
    format: int64
  name:
    type: string
    format: name.firstName
  tag:
    type: string
    format: random.word
```
**Вернет такие данные:**
```json
{
  "id": 23123123123,
  "name": "Petra",
  "tag": "Forest"
}
```

## Использование

### Формат данных
Для создания данных приближанных к реальному API используется [Faker.js](https://github.com/marak/Faker.js/),
который генерит случайные данные на основе поля `format`. Например для того что
бы в строке был email необходимо в поле `type` указать `string`,
а в поле `format` указать `internet.email`.

Полный список форматов можно найти [тут](https://rawgit.com/Marak/faker.js/master/examples/browser/index.html).

### Лимиты
Так же поддерживаются все ограничения Open API спецификации:
- minLength
- maxLength
- minimum
- maximum
- ... e.t.c.

Например для того что бы API возвращало возраст от 10 до 18 мы можем описать такую схему:
```yaml
type: number
minimum: 10
maximum: 18
```

То же самое можно сделать с длинной строки, колличеством элементов в массиве
или использовать [enum](https://swagger.io/docs/specification/data-models/enums/)

Чуть больше о типах и их ограничениях можно прочитать в спеке [Open API](https://swagger.io/docs/specification/data-models/data-types/)

## Изображения
Smogger умеет генерить ссылки на рандомные изображения, используя какой либо
из открытых сервисов рандомных картинок (по дефолту https://picsum.photos).

Сервис можно заменить через конфиг, передав в параметре `-i` ссылку сервис.
Если сервис поддерживает указание в url раземеры картинок можно
указать это в формате `https://picsum.photos/<width>/<height>/?random`.

## ATTENTION
Сейчас генерятся только ответы application/json с кодом 200. В дальнейшем 
это будет доработано.

Так же на данный момент API не умеет работать с float.

