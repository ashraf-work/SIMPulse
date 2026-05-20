import { clsx } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function successResponse(data = {}, message = "Request completed") {
  return NextResponse.json({ success: true, message, data });
}

export function errorResponse(message = "Something went wrong", status = 500, errors = []) {
  return NextResponse.json({ success: false, message, errors }, { status });
}

export function paginationMeta({ page, limit, totalCount }) {
  const safePage = Number(page) || 1;
  const safeLimit = Number(limit) || 10;
  const skip = (safePage - 1) * safeLimit;
  const totalPages = Math.max(Math.ceil(totalCount / safeLimit), 1);
  return {
    page: safePage,
    limit: safeLimit,
    skip,
    totalCount,
    totalPages,
    hasNextPage: safePage < totalPages,
    hasPrevPage: safePage > 1
  };
}

export function parseQuery(request) {
  const { searchParams } = new URL(request.url);
  return Object.fromEntries(searchParams.entries());
}

export function normalizeMongo(document) {
  if (!document) return null;
  const value = typeof document.toObject === "function" ? document.toObject() : document;
  return { ...value, id: String(value._id), _id: undefined };
}
