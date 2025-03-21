import React, { useEffect, useState } from "react";
import companyData from "./MyArray";

const Home = () => {
  const [companies, setCompanies] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    localStorage.clear();
    companyData.forEach((company, index) => {
      localStorage.setItem(`company_${index}_id`, company.id);
      localStorage.setItem(`company_${index}_name`, company.companyName);
      localStorage.setItem(`company_${index}_category`, company.companyCategory);
      localStorage.setItem(`company_${index}_JDdate`, company.JDdate);
      localStorage.setItem(`company_${index}_domain`, company.domain);
    });
    setCompanies(companyData);
  }, []);

  const handleUpdate = (index) => {
    const updatedCompanies = [...companies];
    updatedCompanies[index].companyName = "Updated Company";
    setCompanies(updatedCompanies);
    updateLocalStorage(updatedCompanies);
  };

  const updateLocalStorage = (updatedCompanies) => {
    localStorage.clear();
    updatedCompanies.forEach((company, index) => {
      localStorage.setItem(`company_${index}_id`, company.id);
      localStorage.setItem(`company_${index}_name`, company.companyName);
      localStorage.setItem(`company_${index}_category`, company.companyCategory);
      localStorage.setItem(`company_${index}_JDdate`, company.JDdate);
      localStorage.setItem(`company_${index}_domain`, company.domain);
    });
  };

  const confirmDelete = (index) => {
    setDeleteConfirm(index);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleDelete = (index) => {
    const updatedCompanies = companies.filter((_, i) => i !== index);
    setCompanies(updatedCompanies);
    updateLocalStorage(updatedCompanies);
    setDeleteConfirm(null);
  };

  const formatDomain = (domain) => {
    // Check if it's just a domain name or a full URL
    return domain.startsWith('http') ? domain : `https://${domain.toLowerCase()}`;
  };

  return (
    <div className="home-container">
      <div className="card company-card">
        <div className="card-header">
          <h2>Company List</h2>
          <span className="company-count">{companies.length} companies</span>
        </div>
        
        {companies.length > 0 ? (
          <div className="table-responsive">
            <table className="company-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Company Name</th>
                  <th>Category</th>
                  <th>JD Date</th>
                  <th>Domain</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company, index) => (
                  <tr key={index} className={deleteConfirm === index ? "delete-confirm-row" : ""}>
                    <td>{company.id}</td>
                    <td>{company.companyName}</td>
                    <td>
                      <span className={`category-badge ${company.companyCategory === "Service Based" ? "service" : "product"}`}>
                        {company.companyCategory}
                      </span>
                    </td>
                    <td>{new Date(company.JDdate).toLocaleDateString()}</td>
                    <td>
                      <a 
                        href={formatDomain(company.domain)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="domain-link"
                      >
                        {company.domain} <span className="link-icon">↗</span>
                      </a>
                    </td>
                    <td>
                      {deleteConfirm === index ? (
                        <div className="confirm-actions">
                          <button className="confirm-btn" onClick={() => handleDelete(index)}>Confirm</button>
                          <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
                        </div>
                      ) : (
                        <div className="action-buttons">
                          <button className="update-btn" onClick={() => handleUpdate(index)}>
                            <span className="button-text">Update</span>
                          </button>
                          <button className="delete-btn" onClick={() => confirmDelete(index)}>
                            <span className="button-text">Delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No companies available. Please add a company to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;