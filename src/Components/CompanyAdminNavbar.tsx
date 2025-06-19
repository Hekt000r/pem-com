import "./components.css";
import {Montserrat} from `next/font/google`
interface Company {
    name: string,
    displayName: string,
    imgURL: string
}
interface CompanyAdminNavbarProps {
    imgURL: string;
    company: Company;
}

export default function CompanyAdminNavbar({imgURL, company}: CompanyAdminNavbarProps) {

    return (
    <>
    <div className="h-14 flex shadow-xl">
        <div className="flex p-1.5 ml-1 h-14 items-center">
            <img className="rounded-md w-10 h-10" src={imgURL} alt="" />
            <h1 className="ml-2 font-montserrat">{company.displayName} Admin</h1>
        </div>
    </div>
    </>
  )
}
