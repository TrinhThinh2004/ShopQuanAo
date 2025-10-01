"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert(
      "products",
      [
        {
          name: "Áo Thun Basic 160store",
          description: "Áo thun unisex cotton thoáng mát, form regular.",
          price: 199000,
          stock_quantity: 120,
          category_id: null,
          brand_id: null,
          created_at: now,
          updated_at: now,
        },
        {
          name: "Áo Hoodie Oversize 160store",
          description: "Hoodie oversize nỉ bông dày dặn, ấm áp.",
          price: 399000,
          stock_quantity: 80,
          category_id: null,
          brand_id: null,
          created_at: now,
          updated_at: now,
        },
        {
          name: "Quần Jeans Slimfit 160store",
          description: "Jeans co giãn nhẹ, wash trẻ trung.",
          price: 459000,
          stock_quantity: 60,
          category_id: null,
          brand_id: null,
          created_at: now,
          updated_at: now,
        },
        {
          name: "Jacket Varsity 160store",
          description: "Áo khoác varsity phong cách, bo tay bo gấu.",
          price: 549000,
          stock_quantity: 40,
          category_id: null,
          brand_id: null,
          created_at: now,
          updated_at: now,
        },
        {
          name: "Mũ Lưỡi Trai Classic 160store",
          description: "Cap logo thêu, chất liệu bền nhẹ.",
          price: 159000,
          stock_quantity: 150,
          category_id: null,
          brand_id: null,
          created_at: now,
          updated_at: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("products", null, {});
  },
};
