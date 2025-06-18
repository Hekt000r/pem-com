"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"

type Company = {
    displayName: string;
}


export default function Page({
  params,
}: {
  params: Promise<{ id: string }> // params is now a Promise
}) {
  const { id } = React.use(params) // unwrap the promise
  const [company, setCompany] = useState<Company>()

  useEffect(() => {
    axios.get(`/api/getCompanyByID?companyID=${id}`)
      .then(res => setCompany(res.data))
      .catch(console.error)
  }, [id])
  
  return <div>{company?.displayName} hello</div>
}