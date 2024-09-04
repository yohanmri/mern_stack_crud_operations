import React, { useState, useEffect } from 'react'; 
import './App.css';
import axios from "axios";
import Formtable from './component/Formtable';

axios.defaults.baseURL = "http://localhost:8080/";

function App() {
  const [addSection, setAddSection] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [formDataEdit, setFormDataEdit] = useState({
    name: "", 
    email: "",
    mobile: "",
    _id: ""
  });

  const [datalist, setDataList] = useState([]);

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await axios.post("/create", formData);
    if (data.data.success) {
      setAddSection(false);
      alert(data.data.message);
      getFetchData();
    }
  };

  const getFetchData = async () => {
    const data = await axios.get("/");
    if (data.data.success) {
      setDataList(data.data.data);
    }
  };

  useEffect(() => {
    getFetchData();
  }, []);

  const handleDelete = async (id) => {
    const data = await axios.delete("/delete/" + id);
    if (data.data.success) {
      getFetchData();
      alert(data.data.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = await axios.put("/update/", formDataEdit);
    if (data.data.success) {
      getFetchData();
      alert(data.data.message);
      setEditSection(false);
    }
  };

  const handleEditOnChange = async (e) => {
    const { value, name } = e.target;
    setFormDataEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (el) => {
    setFormDataEdit(el);
    setEditSection(true);
  };

  const filteredDataList = datalist.filter((item) => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.mobile.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="container">
        <button className="btn btn-add" onClick={() => {
          setFormData({
            name: "",
            email: "",
            mobile: "",
          });
          setAddSection(true);
        }}>
          Add
        </button>

        <input
          type="text"
          placeholder="Search..."
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {addSection && (
          <Formtable
            handleSubmit={handleSubmit}
            handleOnChange={handleOnChange}
            handleClose={() => setAddSection(false)}
            rest={formData}
          />
        )}

        {editSection && (
          <Formtable
            handleSubmit={handleUpdate}
            handleOnChange={handleEditOnChange}
            handleClose={() => setEditSection(false)}
            rest={formDataEdit}
          />
        )}

        <div className="boxContainer">
          {filteredDataList.length > 0 ? (
            filteredDataList.map((el) => (
              <div className="box" key={el._id}>
                <h3>{el.name}</h3>
                <p>Email: {el.email}</p>
                <p>Mobile: {el.mobile}</p>
                <button className="btn btn-edit" onClick={() => handleEdit(el)}>Edit</button>
                <button className="btn btn-delete" onClick={() => handleDelete(el._id)}>Delete</button>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>No data</p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
