
    const Linkroles = require("../../models/linkrolesmodel");
    const ViewLinkroles = async (req,res) => {
      try {
        const linkroles = new Linkroles(req.db);
        const data = await linkroles.ViewLinkroles();
        res.status(200).json({ data: data });
      } catch (error) {
        res.status(400).json({error: error.message})
      }
    }
    const ViewSingleLinkroles = async (req,res) => {
      try {
        const { linkroleId } = req.params;
        const linkroles = new Linkroles(req.db);
        linkroles.Id = linkroleId;
        const data = await linkroles.ViewSingleLinkroles();
        res.status(200).json({ data: data });
      } catch (error) {
        res.status(400).json({error: error.message})
      }
    }
    const AddLinkroles = async (req,res) => {
      try {
        const { linkId,userId,expireDate, } = req.body;
        const linkroles = new Linkroles(req.db);
        linkroles.LinkId = linkId
linkroles.UserId = userId
linkroles.ExpireDate = expireDate

        linkroles.createdBy = req.user.id;
        const results = await linkroles.AddLinkroles();
        if(results?.success == false) {
          return res.status(400).json({msg: "something went wrong"});
        }
        res.status(200).json({msg: "Linkroles added successfully"});
      } catch (error) {
        res.status(400).json({error: error.message})
      }
    }
    const UpdateLinkroles = async (req,res) => {
      try {
        const { linkId,userId,expireDate, } = req.body;
        const { linkroleId } = req.params;
        const linkroles = new Linkroles(req.db);
        linkroles.Id = linkroleId;
        linkroles.LinkId = linkId
linkroles.UserId = userId
linkroles.ExpireDate = expireDate

        linkroles.updatedBy = req.user.id;
        const results = await linkroles.UpdateLinkroles();
        if(results?.success == false) {
          return res.status(400).json({msg: "something went wrong"});
        }
        res.status(200).json({msg: "Linkroles updated successfully"});
      } catch (error) {
        res.status(400).json({error: error.message})
      }
    }
    const DeleteLinkroles = async (req,res) => {
      try {
        const { linkroleId } = req.params;
        const linkroles = new Linkroles(req.db);
        linkroles.Id = linkroleId;
        const results = await linkroles.DeleteLinkroles();
        if(results?.success == false) {
          return res.status(400).json({msg: "something went wrong"});
        }
        res.status(200).json({msg: "Linkroles removed successfully"});
      } catch (error) {
        res.status(400).json({error: error.message})
      }
    }
    module.exports = {
      AddLinkroles,
      UpdateLinkroles,
      DeleteLinkroles,
      ViewLinkroles,
      ViewSingleLinkroles,
    }
    