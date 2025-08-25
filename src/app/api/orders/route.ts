import { NextResponse } from "next/server";
import { Order } from "@/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, totalAmount, customerName, phoneNumber, email } = body;

    // Здесь можно добавить валидацию данных
    if (!items || !totalAmount || !customerName || !phoneNumber || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Создаем заказ
    const order: Order = {
      id: `order-${Date.now()}`, // Временный ID, в реальном приложении генерируется на сервере
      items,
      totalAmount,
      status: 'pending',
      createdAt: new Date(),
      customerName,
      phoneNumber,
      email,
    };

    // В реальном приложении здесь была бы сохранение в базу данных
    console.log('Order created:', order);

    return NextResponse.json({ order });
  } catch (err: any) {
    console.error("Error creating order:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
