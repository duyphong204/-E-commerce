import { Request, Response, NextFunction } from "express";

export const responseFormatter = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;

  res.json = function (body: any) {
    if (
      body &&
      typeof body === "object" &&
      ("success" in body && "statusCode" in body)
    ) {
      return originalJson.call(this, body);
    }

    const statusCode = res.statusCode || 200;

    let formattedBody: any = {
      success: true,
      statusCode,
      message: body?.message || "Thao tác thành công",
    };

    if (body) {
      const { message, results, page, totalPages, totalItems, ...rest } = body;

      // If it contains pagination info
      if (results !== undefined && page !== undefined && totalPages !== undefined) {
        formattedBody.data = results;
        formattedBody.meta = {
          page,
          totalPages,
          totalItems,
          ...rest
        };
      } else {
        // If message is in the body, put everything else in data
        if (message !== undefined) {
          formattedBody.data = Object.keys(rest).length > 0 ? rest : undefined;
        } else {
          formattedBody.data = body;
        }
      }
    }

    return originalJson.call(this, formattedBody);
  };

  next();
};
