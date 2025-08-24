#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Начинаем деплой проекта DineNation на Amazon S3${NC}"

# Проверяем наличие AWS CLI
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI не установлен. Установите его:${NC}"
    echo "https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Проверяем настройку AWS
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS не настроен. Выполните: aws configure${NC}"
    exit 1
fi

# Запрашиваем имя bucket
echo -e "${YELLOW}📝 Введите имя вашего S3 bucket:${NC}"
read -r BUCKET_NAME

if [ -z "$BUCKET_NAME" ]; then
    echo -e "${RED}❌ Имя bucket не может быть пустым${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Используем bucket: ${BUCKET_NAME}${NC}"

# Устанавливаем зависимости
echo -e "${YELLOW}📦 Устанавливаем зависимости...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при установке зависимостей${NC}"
    exit 1
fi

# Собираем проект
echo -e "${YELLOW}🔨 Собираем проект для продакшена...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при сборке проекта${NC}"
    exit 1
fi

# Проверяем наличие папки .next
if [ ! -d ".next" ]; then
    echo -e "${RED}❌ Папка .next не найдена. Проверьте настройки next.config.ts${NC}"
    exit 1
fi

# Загружаем статические файлы на S3
echo -e "${YELLOW}☁️ Загружаем статические файлы на S3...${NC}"
aws s3 sync .next/static s3://$BUCKET_NAME/_next/static --delete

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при загрузке статических файлов на S3${NC}"
    exit 1
fi

# Получаем регион bucket
REGION=$(aws s3api get-bucket-location --bucket $BUCKET_NAME --query 'LocationConstraint' --output text)

if [ "$REGION" = "None" ]; then
    REGION="us-east-1"
fi

echo -e "${GREEN}🎉 Деплой завершен успешно!${NC}"
echo -e "${GREEN}🌐 Ваш сайт доступен по адресу:${NC}"
echo -e "${YELLOW}http://${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com${NC}"

# Проверяем настройки статического хостинга
echo -e "${YELLOW}⚠️ Убедитесь, что в настройках S3 bucket включен Static website hosting:${NC}"
echo "1. Перейдите в AWS Console → S3 → ${BUCKET_NAME}"
echo "2. Properties → Static website hosting"
echo "3. Включите Static website hosting"
echo "4. Index document: index.html"
echo "5. Error document: 404.html"

echo -e "${YELLOW}⚠️ Важно: Для полной функциональности рекомендуется настроить CloudFront${NC}"
echo "CloudFront обеспечит поддержку динамических роутов и лучшую производительность"

echo -e "${GREEN}✨ Готово! Ваш проект DineNation успешно задеплоен на Amazon S3${NC}"
echo -e "${GREEN}📚 Подробная инструкция: deploy-to-s3.md${NC}"
