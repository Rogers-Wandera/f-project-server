const axios = require("axios").default;

class ClassifierClass extends axios.Axios {
  constructor() {
    super();
    this.url = process.env.CLASSIFIER_URL;
    this.token = null;
    this.data = {};
  }

  trainClassifier = async (url) => {
    try {
      if (!this.token) {
        throw new Error("No token found");
      }
      const response = await axios.post(`${this.url}${url}`, this.data, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response;
    } catch (error) {
      if ("response" in error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  };

  checkVariants = async () => {
    try {
      const response = await axios.get(`${this.url}/classifier/variants`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      if ("response" in error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  };
}

module.exports = ClassifierClass;
