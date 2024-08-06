import "regenerator-runtime/runtime"; // גורם לתמיכה של פונקציות אסינכרוניות ובגינרטורס
import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "react-resizable/css/styles.css";
import DraggableItem from "./CreateBlockForTemplate3";

//const apiUrlTemplate = 'https://localhost:44326/api/Templates';
//const apiUrlBlock = 'https://localhost:44326/api/BlocksInTemplates';
const apiUrlTemplate = "https://localhost:7224/api/Templates";
const apiUrlBlock = "https://localhost:7224/api/BlocksInTemplates";

function CreateTemplate3() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [template, setTemplate] = useState(
    state.template || { TemplateName: "", description: "", IsPublic: false }
  );
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState(state.items || []);
  const [nextBlockNumber, setNextBlockNumber] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState();

  useEffect(() => {
    // לקרוא את הנתונים מה-sessionStorage כאשר הקומפוננטה נטענת
    const user = sessionStorage.getItem("user");
    console.log(user);
    if (user) {
      const parsedUser = JSON.parse(user);
      const newUser = {
        ConfirmPassword: parsedUser.confirmPassword,
        DomainName: parsedUser.domainName,
        Email: parsedUser.email,
        Employee: parsedUser.employee,
        Job: parsedUser.job,
        LangName: parsedUser.langName,
        Password: parsedUser.password,
        Phone: parsedUser.phone,
        Signature: parsedUser.signature,
        UserName: parsedUser.userName,
      };
      console.log(newUser);
      setUser(newUser);
    }
  }, []);

  console.log(user);

  const updateItem = useCallback(
    (index, field, value) => {
      const newItems = items.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      );
      setItems(newItems);
    },
    [items]
  );

  const moveItem = useCallback(
    (dragIndex, hoverIndex) => {
      const newItems = [...items];
      const dragItem = newItems[dragIndex];
      newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, dragItem);
      setItems(newItems);
    },
    [items]
  );

  const addBlock = useCallback(
    (type) => {
      const blockNo = nextBlockNumber.toString();
      setNextBlockNumber(nextBlockNumber + 1);

      const newItem = {
        TemplateNo: template.TemplateNo,
        BlockNo: blockNo,
        Type: type,
        Title: "",
        Text: "",
        KeyWord: "",
        IsActive: false,
        IsMandatory: false,
      };

      setItems((items) => [...items, newItem]);
    },
    [nextBlockNumber, template.TemplateNo]
  );
  //חזרה לדף הבית
  const handleButtonClick = () => {
    navigate("/HomePage");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const templateResponse = await fetch(apiUrlTemplate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(template),
      });

      if (!templateResponse.ok) {
        throw new Error(`HTTP error! Status: ${templateResponse.status}`);
      }

      const templateResult = await templateResponse.json();
      console.log("Create Template successfully", templateResult);

      for (const block of items) {
        const blockToSend = {
          ...block,
          BlockNo: block.BlockNo.toString(),
        };

        const blockResponse = await fetch(apiUrlBlock, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(blockToSend),
        });

        if (!blockResponse.ok) {
          throw new Error(`HTTP error! Status: ${blockResponse.status}`);
        }

        const blockResult = await blockResponse.json();
        console.log("Block inserted successfully:", blockResult);
      }

      navigate("/TemplateCreatedSuccessfully", {
        state: {
          template: template,
          selectedTemplateBlocks: items,
          user: user,
          origin: "CreateTemplate3",
        },
      });
    } catch (error) {
      console.error("Error during the POST process:", error.message);
    }
  };

  console.log(items);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex items-center justify-center min-h-screen bg-light-blue-500">
        <div
          className="card w-full max-w-md bg-base-100 shadow-xl p-5"
          style={{ backgroundColor: "#E4E9F2" }}
        >
          <div className="card-body flex items-center justify-center">
            <form onSubmit={handleSubmit} className="space-y-4">
              <label
                className="btn btn-circle swap swap-rotate"
                style={{
                  position: "absolute",
                  top: "30px",
                  left: "20px",
                  backgroundColor: "#E4E9F2",
                  borderColor: "#E4E9F2",
                }}
                onClick={handleButtonClick} //חזרה למסך הבית
              >
                <input type="checkbox" />
                <svg
                  className="swap-off fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 512 512"
                >
                  <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                </svg>
                <svg
                  className="swap-on fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 512 512"
                >
                  <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                </svg>
              </label>

              <div
                className="steps space-x-2 mb-4"
                style={{ marginTop: "50px", marginBottom: "50px" }}
              >
                <div
                  className="step step-primary"
                  style={{ color: "#070A40" }}
                  data-content="✓"
                >
                  Name
                </div>
                <div className="step step-primary" data-content="✓">
                  Structure
                </div>
                <div className="step step-primary">Key Words</div>
              </div>
              <h3
                className="text-dark-blue-500"
                style={{
                  margin: "0 auto",
                  textAlign: "center",
                  fontSize: "20px",
                  color: "#070A40",
                }}
              >
                <b>Key Words</b>
              </h3>

              <div
                style={{
                  margin: "10px",
                  padding: "10px",
                  minHeight: "50px", // שונה לגובה מינימלי נמוך
                  border: "1px solid #070A40",
                  position: "relative",
                  borderRadius: "0.6rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      marginRight: "auto",
                      fontSize: "14px",
                      color: "#070A40",
                      position: "relative",
                      top: "-3px",
                    }}
                  >
                    <b>Name:</b> {template.TemplateName}
                  </span>
                </div>
                <div
                  style={{
                    borderBottom: "1px solid silver",
                    width: "100%",
                    marginBottom: "2rem",
                  }}
                ></div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <span style={{ marginRight: "auto", color: "#070A40" }}>
                    <span style={{ color: "red" }}>
                      <b>*</b>
                    </span>{" "}
                    <b>Defining keywords</b>
                  </span>
                  <div className="info-container">
                    <span
                      style={{ color: "#2D37EC" }}
                      className={`cursor-pointer info-title ${
                        isOpen ? "open" : ""
                      }`}
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      More info
                      <span
                        className={`arrow ${
                          isOpen ? "arrow-up" : "arrow-down"
                        }`}
                      ></span>
                    </span>
                  </div>
                </div>
                {isOpen && (
                  <div>
                    <p className="keyWordP" style={{ textAlign: "left" }}>
                      In this page, you need to define a keyword for each block.
                      The keyword will assist you during the automated
                      transcription process. When you speak the keyword, the
                      transcription will start writing into that specific block.
                      By default, the text's title is set as the keyword, but
                      you can change it to any word you prefer.
                    </p>
                  </div>
                )}
                <div
                  style={{
                    borderBottom: "1px solid silver",
                    width: "100%",
                    marginBottom: "2rem",
                  }}
                ></div>

                <div
                  style={{
                    borderBottom: "1px solid silver",
                    width: "100%",
                    marginBottom: "2rem",
                  }}
                >
                  {items.map((item, index) => {
                    if (item.Type === "file") {
                      return (
                        <div key={index}>
                          <input
                            type="file"
                            onChange={(e) => {
                              // Handle file upload
                            }}
                          />
                        </div>
                      );
                    }
                    return (
                      <DraggableItem
                        key={index}
                        item={item}
                        index={index}
                        moveItem={moveItem}
                        updateItem={updateItem}
                      />
                    );
                  })}
                </div>
                <label className="label cursor-pointer justify-start space-x-2">
                  <span className="label-text">Make template public?</span>
                  <input
                    style={{
                      borderColor: "#070A40",
                      backgroundColor: template.IsPublic
                        ? "#070A40"
                        : "#E4E9F2",
                    }}
                    type="checkbox"
                    checked={template.IsPublic}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        IsPublic: e.target.checked,
                      })
                    }
                    className="checkbox checkbox-primary"
                  />
                </label>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/CreateTemplate2", {
                      state: {
                        template,
                        items,
                        origin: "CreateTemplate3",
                      },
                    })
                  }
                  className="btn btn-outline btn-primary new btn-sm back"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm continue"
                >
                  Save template
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default CreateTemplate3;
