"use client";
import { Button, SearchField, Separator } from "@heroui/react";
import { Building2, Search } from "lucide-react";
import { useState } from "react";
import { FaCity } from "react-icons/fa6";

export default function SearchHero() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCity, setSearchCity] = useState("");

  return (
    <div className="bg-linear-to-r from-blue-600 to-sky-700 w-full h-80">
      <div className="flex flex-col justify-center items-center h-[100%]">
        <h1 className="text-white font-montserrat font-semibold text-4xl">
          Gjej punën e ëndrrave
        </h1>
        <h2 className="text-white opacity-90 font-semibold font-montserrat text-xl mt-3 mb-1">
          Kërkoni nga mbi 100 shpallje pune!
        </h2>
        <div className="bg-white w-fit h-12 px-2 mt-4 rounded-xl flex items-center">
          <div className="flex items-center space-x-4">
            <SearchField>
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input
                  placeholder="Pozicioni, kompania ..."
                  className="w-60"
                />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
            <div>
              <Separator className="h-6" orientation="vertical" />
            </div>
            <SearchField>
              <SearchField.Group>
                <SearchField.SearchIcon>
                  <Building2 />
                </SearchField.SearchIcon>
                <SearchField.Input placeholder="Qyteti" className="w-60" />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>

            <a href={`/jobs?searchTerm=${encodeURIComponent(searchTerm)}&searchCity=${encodeURIComponent(searchCity)}`} className="flex items-center justify-center">
              <Button>
                <Search />
                Kërko
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
