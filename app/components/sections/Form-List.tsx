import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { getAllForms, useFormStore } from "~/store/formStore";
import { Link } from "@remix-run/react";

const FormList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const allForms = getAllForms();
    setItems(allForms);
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {items.map((item, index) => (
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className=" text-sm mb-4">{item.description}</p>
            <div className="flex justify-between items-center">
              <Link to={`/form/${item.id}`}>
                <Button size="sm">View Form</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FormList;
