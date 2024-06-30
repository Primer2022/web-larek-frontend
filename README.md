# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Архитектура: MVC

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом
- src/types — папка с моделями данных

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/mixins/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

Классы модели:
- src/types/model/basket-model.ts — файл модель корзины
- src/types/model/catalog-model.ts — файл модель каталога
- src/types/model/form-model.ts — файл модель формы
- src/types/model/product-model.ts — файл модель товара
- src/types/model/view-model.ts — файл модель отображения

Классы представления:
- src/types/view/basket-view.ts — файл с представлениями корзины
- src/types/view/product-view.ts — файл с представлениями товара

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
