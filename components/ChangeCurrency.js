import React, { useRef } from "react";
import { Form } from "react-bootstrap";

function ChangeCurrency() {
  const currencyRef = useRef();

  return (
    <>
      {/* <Form>
        <Form.Select type="text" ref={currencyRef} size="sm" style={{ width: "74px" }}>
          <option value="pln">PLN</option>
          <option value="usd">USD</option>
        </Form.Select>
      </Form> */}
    </>
  );
}

export default ChangeCurrency;
