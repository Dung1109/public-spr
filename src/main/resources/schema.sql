DROP TABLE IF EXISTS Cert;
DROP TABLE IF EXISTS Category;

-- Create the 'Category' table
CREATE TABLE Category (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR(255) NOT NULL UNIQUE,
                          descriptions VARCHAR(1000)
);

-- Create the 'Cert' table
CREATE TABLE Cert (
                      id VARCHAR(12) PRIMARY KEY,
                      cert_name VARCHAR(255) NOT NULL,
                      cost DECIMAL(5, 1) NOT NULL,
                      Categoryid INT,
                      CONSTRAINT fk_category FOREIGN KEY (Categoryid)
                          REFERENCES Category (id)
);
