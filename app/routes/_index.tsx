import { Link } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { TemplateSelector } from "~/components/form-builder/TemplateSelector";
import { MetaFunction } from "@remix-run/react";
import { ModeToggle } from "~/components/form-builder/mode-toggle";
import { useEffect } from "react";
import { PcCase } from "lucide-react";
import FormList from "~/components/sections/Form-List";
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const allItems = {};

  useEffect(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      allItems[key] = localStorage.getItem(key);
    }

    console.log(localStorage.getItem("form_list"));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br ">
      <div className="container mx-auto px-4 py-12">
        <ModeToggle />
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold  mb-4">Form Builder Pro</h1>
          <p className="text-xl  -600 mb-8 max-w-2xl mx-auto">
            Create beautiful, responsive forms with drag-and-drop ease{" "}
          </p>

          <div className="flex justify-center space-x-4">
            <Link to="/builder">
              <Button size="lg" className="px-8 py-3 text-lg">
                🚀 Start Building
              </Button>
            </Link>
          </div>
        </div>

        <div className="">
          <FormList />
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center  -900 mb-8">
            Choose a Template to Get Started
          </h2>
          <TemplateSelector />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold  -800 mb-4">
            Ready to build your first form?
          </h2>
          <Link to="/builder">
            <Button size="lg" className="px-8 py-3 text-lg">
              Create New Form
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
