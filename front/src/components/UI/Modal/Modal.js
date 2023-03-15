import "./Modal.css";
import { AnimatePresence, motion } from "framer-motion";
import ReactDOM from "react-dom";
import React, { cloneElement, forwardRef, useImperativeHandle, useState } from "react";
const Modal = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  useImperativeHandle(ref, () => {
    return {
      open: () => setOpen(true),
      close: () => setOpen(false),
    };
  });
  return ReactDOM.createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal text-white"
          id="exampleModal"
          tabIndex="-1"
          style={{ display: "block" }}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: {
              duration: 0.15,
            },
          }}
          exit={{
            opacity: 0,
            transition: {
              delay: 0.3,
            },
          }}
        >
          <motion.div
            className={`modal-dialog ${props.dialogClasses}`}
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
              transition: {
                duration: 0.3,
              },
            }}
            exit={{
              x: 50,
              opacity: 0,
              transition: {
                duration: 0.3,
              },
            }}
          >
            <motion.div className={`modal-content ${props.contentClasses}`}>
              <motion.div className={`modal-header ${props.headerClasses}`}>
                {props.type === "Upload" && (
                  <React.Fragment>
                    <i className="col-4 d-none d-md-block fas fa-user-circle fs-1 align-self-end ms-2"></i>
                    <div className="col-12 col-md-4 text-center">
                      <h2 className="modal-title" id="exampleModalLabel">
                        Opinar en:
                      </h2>
                      <h3 className="modal-title" id="exampleModalLabel">
                        Tema elegido
                      </h3>
                    </div>
                  </React.Fragment>
                )}

                <button
                  type="button"
                  className="btn-close align-self-lg-start"
                  onClick={() => {
                    setOpen(false);
                  }}
                ></button>

                {props.type === "Profile" && (
                  <React.Fragment>
                    <div className="col-12 text-center">
                      <h1 className="modal-title" id="exampleModalLabel">
                        {props.header}
                      </h1>
                    </div>
                  </React.Fragment>
                )}
              </motion.div>
              <motion.div className="modal-body">
                { 
                  props.type === "Upload" &&
                  cloneElement(props.children, {setOpen: setOpen})
                }
                {
                  props.type !== "Upload" &&
                  props.children
                }
              </motion.div>
              {props.type === "Upload" && (
                <React.Fragment>
                  <div className="modal-footer justify-content-center mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary text-white px-5 py-2"
                      form="modal-upload-form"
                    >
                      Opinar
                    </button>
                  </div>
                </React.Fragment>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("overlay-root")
  );
});
export default Modal;
