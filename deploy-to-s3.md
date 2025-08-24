# Деплой проекта на Amazon S3

## 1. Сборка проекта

### Установка зависимостей
```bash
npm install
```

### Сборка для продакшена
```bash
npm run build
```

После сборки в папке `.next/` будет оптимизированная версия сайта.

## 2. Настройка Amazon S3

### Создание bucket
1. Зайдите в AWS Console → S3
2. Создайте новый bucket с именем (например: `dinenation-website`)
3. Выберите регион (рекомендуется близкий к вашим пользователям)
4. Отключите блокировку всех публичных настроек (если нужно)

### Настройка bucket для статического хостинга
1. Выберите ваш bucket
2. Перейдите в Properties → Static website hosting
3. Включите Static website hosting
4. Укажите:
   - Index document: `index.html`
   - Error document: `404.html`

### Настройка политики доступа
Создайте bucket policy для публичного доступа:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        }
    ]
}
```

## 3. Загрузка файлов

### Вариант 1: Через AWS CLI (рекомендуется)
```bash
# Установка AWS CLI
aws configure

# Создание статических файлов
npm run build

# Загрузка файлов из .next/static
aws s3 sync .next/static s3://YOUR-BUCKET-NAME/_next/static --delete

# Загрузка HTML файлов (если есть)
aws s3 sync .next/server s3://YOUR-BUCKET-NAME --delete
```

### Вариант 2: Через AWS Console
1. Откройте ваш bucket
2. Нажмите Upload
3. Выберите файлы из папки `.next/static`
4. Загрузите файлы

## 4. Настройка CloudFront (рекомендуется)

Для лучшей производительности и поддержки динамических роутов настройте CloudFront:
1. Создайте CloudFront distribution
2. Укажите S3 bucket как origin
3. Настройте кэширование
4. Включите поддержку динамических роутов

## 5. Альтернативный подход: Деплой через Vercel

Если у вас возникают сложности с S3, рассмотрите деплой через Vercel:

```bash
# Установка Vercel CLI
npm i -g vercel

# Деплой
vercel --prod
```

## 6. Проверка деплоя

После загрузки файлов ваш сайт будет доступен по адресу:
- S3: `http://YOUR-BUCKET-NAME.s3-website-REGION.amazonaws.com`
- CloudFront: `https://YOUR-DISTRIBUTION-ID.cloudfront.net`

## 7. Автоматизация деплоя

### Создайте скрипт deploy.sh:
```bash
#!/bin/bash
echo "Building project..."
npm run build

echo "Uploading static files to S3..."
aws s3 sync .next/static s3://YOUR-BUCKET-NAME/_next/static --delete

echo "Deploy complete!"
echo "URL: http://YOUR-BUCKET-NAME.s3-website-REGION.amazonaws.com"
```

### Сделайте скрипт исполняемым:
```bash
chmod +x deploy.sh
```

### Запустите деплой:
```bash
./deploy.sh
```

## Важные замечания

1. **Стандартная сборка Next.js**: Проект использует обычную сборку, а не статический экспорт
2. **Динамические роуты**: Поддерживаются через CloudFront или Vercel
3. **Изображения**: Настроены как `unoptimized: true` для статического хостинга
4. **Локальное хранилище**: Корзина и заказы будут работать только в рамках одной сессии
5. **Рекомендуется CloudFront**: Для полной функциональности динамических роутов

## Troubleshooting

### Ошибка "Module not found"
```bash
npm install
npm run build
```

### Файлы не загружаются в S3
Проверьте права доступа и bucket policy

### Сайт не отображается
Проверьте настройки Static website hosting в S3

### Динамические роуты не работают
Настройте CloudFront или используйте Vercel для деплоя
