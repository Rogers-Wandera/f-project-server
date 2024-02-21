const { format } = require("date-fns");
const { checkExpireDate } = require("../helpers/helperfuns");

const InsertSchedule = async (db, records, tablename, action) => {
  try {
    if (records > 0) {
      await db.insertOne("schedulerrun", {
        original_table_name: tablename,
        records_affected: records,
        action: action,
        isActive: 1,
        daterun: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      });
      return true;
    }
    return false;
  } catch (error) {
    return error;
  }
};

const CheckAccessRights = async (db) => {
  try {
    const records = await db.findByConditions("temrouteroles", {
      isActive: 1,
    });
    const expiredRights = [];
    if (records.length > 0) {
      records.forEach((record) => {
        const checkExpire = checkExpireDate(record.expireTime);
        if (checkExpire) {
          expiredRights.push(record);
        }
      });
    }

    let updatedRecords = 0;
    if (expiredRights.length > 0) {
      expiredRights.forEach(async (record) => {
        const findItems = await db.findByConditions("tempmethods", {
          tempRouteId: record.id,
        });
        await db.updateOne("temrouteroles", { id: record.id }, { isActive: 0 });
        if (findItems.length > 0) {
          findItems.forEach(async (item) => {
            await db.updateOne("tempmethods", { id: item.id }, { isActive: 0 });
          });
        }
      });
      updatedRecords = expiredRights.length;
    }
    await InsertSchedule(db, updatedRecords, "temrouteroles", "deactivation");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { CheckAccessRights };
