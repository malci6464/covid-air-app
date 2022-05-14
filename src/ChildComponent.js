import React from "react";

export function ChildComponent(props) {
  let res = () => !props.toChild;
  let res2 = () => (res ? "true" : "false");

  return (
    <>
      <button
        onClick={() => {
          console.log("sending data", props.toChild);
          props.sendToParent(res2);
        }}
      >
        Update
      </button>
      <p>The state of isParentData is {res2}</p>
    </>
  );
}
