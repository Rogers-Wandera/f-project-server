const { v4: uuidv4 } = require("uuid");
const { format } = require("date-fns");
const Model = require("../../models/modal");

const CheckPersonExists = async (req, id) => {
  try {
    const findExists = await req.db.findOne("person", {
      nationalId: id,
    });
    return findExists;
  } catch (error) {
    throw new Error(error.message);
  }
};

const CreatePerson = async (req, res) => {
  try {
    const { firstName, lastName, gender, nationalId, status } = req.body;
    const personobj = {
      firstName,
      lastName,
      gender,
      status,
      nationalId: nationalId.toUpperCase(),
    };
    const personExits = await CheckPersonExists(req, nationalId);
    if (personExits) {
      return res
        .status(401)
        .json({ msg: `Person with ${nationalId} already exists` });
    }
    const splitid = nationalId.substring(2);
    const uniqueId = `${uuidv4()}-${splitid}`;
    personobj["id"] = uniqueId;
    personobj["isActive"] = 1;
    personobj["createdAt"] = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    personobj["createdBy"] = req.user.id;
    const person = await req.db.insertOne("person", personobj);
    if (!person?.success) {
      return res.status(500).json({ msg: "Something went wrong" });
    }
    res.status(200).json({ msg: "Person created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const UpdatePersonData = async (req, res) => {
  try {
    const { firstName, lastName, gender, nationalId, status } = req.body;
    const { personId } = req.params;
    const personobj = {
      firstName,
      lastName,
      gender,
      status,
      nationalId: nationalId.toUpperCase(),
    };
    const personExists = await req.db.findByConditions("person", {
      id: personId,
    });
    if (personExists.length <= 0) {
      return res
        .status(401)
        .json({ msg: "Person with that id does not exist" });
    }
    personobj["updatedOn"] = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    personobj["updatedBy"] = req.user.id;

    const results = await req.db.updateOne(
      "person",
      { id: personExists[0].id },
      personobj
    );
    if (!results) {
      return res.status(500).json({ msg: "Something went wrong" });
    }
    res.status(200).json({ msg: "Person updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const DeletePerson = async (req, res) => {
  try {
    const { personId } = req.params;
    const personExists = await req.db.findByConditions("person", {
      id: personId,
      isActive: 1,
    });
    if (personExists.length <= 0) {
      return res
        .status(401)
        .json({ msg: "Person with that id does not exist" });
    }
    const results = await req.db.softDelete("person", { id: personId });
    if (!results) {
      return res.status(500).json({ msg: "Something went wrong" });
    }
    res.status(200).json({ msg: "Meta deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const AddPersonMeta = async (req, res) => {
  try {
    const { metaName, metaDesc } = req.body;
    const { personId } = req.params;
    const personExists = await req.db.findByConditions("person", {
      id: personId,
    });
    if (personExists.length <= 0) {
      return res
        .status(401)
        .json({ msg: "Person with that id does not exist" });
    }
    const findMetaExists = await req.db.findByConditions("personmeta", {
      personId,
      metaName,
    });
    if (findMetaExists.length > 0) {
      return res
        .status(400)
        .json({ msg: "Meta with that name already exists" });
    }
    const metaobj = {
      metaName,
      metaDesc,
    };
    metaobj["createdAt"] = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    metaobj["isActive"] = 1;
    metaobj["personId"] = personId;
    metaobj["createdBy"] = req.user.id;
    const results = await req.db.insertOne("personmeta", metaobj);
    if (!results?.success) {
      return res.status(500).json({ msg: "Something went wrong" });
    }
    res.status(200).json({ msg: "Meta added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const UpDatePersonMeta = async (req, res) => {
  try {
    const { personId } = req.params;
    const { metaId } = req.query;
    const { metaName, metaDesc } = req.body;
    const personExists = await req.db.findByConditions("person", {
      id: personId,
    });
    if (personExists.length <= 0) {
      return res
        .status(401)
        .json({ msg: "Person with that id does not exist" });
    }
    const findMeta = await req.db.findByConditions("personmeta", {
      id: metaId,
      personId: personId,
    });
    if (findMeta.length <= 0) {
      return res.status(400).json({ msg: "No meta found" });
    }
    const metaobj = {
      metaName,
      metaDesc,
      updatedOn: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      updatedBy: req.user.id,
    };

    const results = await req.db.updateOne(
      "personmeta",
      { id: metaId },
      metaobj
    );
    if (!results) {
      return res.status(500).json({ msg: "Something went wrong" });
    }
    res.status(200).json({ msg: "Meta updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const DeletePersonMeta = async (req, res) => {
  try {
    const { personId } = req.params;
    const { metaId } = req.query;
    const personExists = await req.db.findByConditions("person", {
      id: personId,
    });
    if (personExists.length <= 0) {
      return res
        .status(401)
        .json({ msg: "Person with that id does not exist" });
    }
    const findMeta = await req.db.findByConditions("personmeta", {
      id: metaId,
      personId: personId,
    });
    if (findMeta.length <= 0) {
      return res.status(400).json({ msg: "No meta found" });
    }
    const results = await req.db.softDelete("personmeta", { id: metaId });
    if (!results) {
      return res.status(500).json({ msg: "Something went wrong" });
    }
    res.status(200).json({ msg: "Meta deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const GetPersonData = async (req, res) => {
  try {
    const { start, size, filters, globalFilter, sorting } = req.query;
    const persons = new Model(req.db);
    persons.table = "person";
    persons.page = parseInt(start);
    persons.limit = parseInt(size);
    persons.filters = JSON.parse(filters);
    persons.globalFilter = globalFilter;
    persons.sortBy = JSON.parse(sorting);
    const data = await persons.__viewCustomQueryPaginate(
      `SELECT *FROM personsdata WHERE isActive = 1`
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const GetSinglePerson = async (req, res) => {
  try {
    const { personId } = req.params;
    const query = "SELECT *FROM personsdata WHERE isActive = 1 AND id = ?";
    const response = await req.db.executeQuery(query, [personId]);
    let data = {};
    if (response.length > 0) {
      data = response[0];
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const GetPersonMetaData = async (req, res) => {
  try {
    const { personId } = req.params;
    const { start, size, filters, globalFilter, sorting } = req.query;
    const permonmeta = new Model(req.db);
    permonmeta.table = "personmeta";
    permonmeta.page = parseInt(start);
    permonmeta.limit = parseInt(size);
    permonmeta.filters = JSON.parse(filters);
    permonmeta.globalFilter = globalFilter;
    permonmeta.sortBy = JSON.parse(sorting);
    const query = `SELECT pm.*,ps.fullName, CONCAT(us.firstname, ' ', us.lastname)
    as createdByName FROM personmeta pm INNER JOIN personsdata ps ON ps.id = pm.personId 
    LEFT JOIN users us ON us.id = pm.createdBy WHERE pm.personId = ? AND pm.isActive = 1`;
    const data = await permonmeta.__viewCustomQueryPaginate(query, [personId]);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const GetMetaDataSingle = async (req, res) => {
  try {
    const { personId, metaId } = req.params;
    const personExists = await req.db.findByConditions("person", {
      id: personId,
    });
    if (personExists.length <= 0) {
      return res
        .status(401)
        .json({ msg: "Person with that id does not exist" });
    }
    const findMeta = await req.db.findByConditions("personmeta", {
      id: metaId,
      personId: personId,
    });
    if (findMeta.length <= 0) {
      return res.status(400).json({ msg: "No meta found" });
    }
    const data = await req.db.performJoin(
      "personmeta",
      [
        {
          table: "person",
          alias: "p",
          condition: "p.id = mt.personId",
          join: "INNER",
          columns: ["CONCAT(p.firstName, ' ', p.lastName) as personName"],
        },
      ],
      { "mt.isActive": 1, "mt.personId": personId, "mt.id": metaId }
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  CreatePerson,
  AddPersonMeta,
  UpDatePersonMeta,
  DeletePersonMeta,
  GetPersonData,
  GetSinglePerson,
  GetPersonMetaData,
  GetMetaDataSingle,
  UpdatePersonData,
  DeletePerson,
};
