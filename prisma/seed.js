const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const main = async () => {
  await prisma.Order_Statuses.createMany({
    data: [
      { value: "New" },
      { value: "Dispatched" },
      { value: "Cancelled By Client" },
      { value: "Cancelled By Vendor" },
      { value: "Cancelled(Other Reason)" }
    ],
  });


  await prisma.Shipping_Settings.createMany({
    data : [
      { tax : 15 , shippingFee : 10 },
    ]
  })

};



main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });