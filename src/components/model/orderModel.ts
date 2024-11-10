import { IOrder } from "../../types";

export class OrderModel {
  protected address: string;
  protected email: string;
  protected items: string[];
  protected payment: string;
  protected phone: string;
  protected total: number;

  setAddress(address: string): void {
    this.address = address;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setItems(items: string[]): void {
    this.items = items;
  }

  setPayment(payment: string): void {
    this.payment = payment;
  }

  setPhone(phone: string): void {
    this.phone = phone;
  }

  setTotal(total: number): void {
    this.total = total;
  }

  validateContactForm(email: string, phone: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const phonePattern = /^\+7\d{3}\d{3}\d{4}$/;

    if (!emailPattern.test(email)) return false;
    if (!phonePattern.test(phone)) return false;
    return true;
  }

  getOrder(): IOrder {
    return {
      address: this.address,
      email: this.email,
      items: this.items,
      payment: this.payment,
      phone: this.phone,
      total: this.total,
    }
  }
}