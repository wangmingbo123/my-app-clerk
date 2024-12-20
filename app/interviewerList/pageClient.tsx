'use client'
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

import { useRouter, usePathname } from 'next/navigation';

import { useSearchParams } from 'next/navigation';

import { Search, Star, Home, Users, MessageSquare, User } from "lucide-react"
import listUrl from "@/lib/requestUtil"
import { axios } from "@/lib/axios"
import {getCurrentUser} from "@/lib/session";



interface Interviewer {
  id: number
  name: string
  expertise: string
  experience: string
  price: number
  avatar: string
  rating: number
}




export default function InterviewerList({user}) {
// function InterviewerList() {
  const [interviewers, setInterviewers] = useState<Interviewer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // const url = "https://noxious-spooky-cauldron-v6rgv6j7xq9hwv6r-3000.app.github.dev/api/learn"
  // const url = `${process.env.NEXT_PUBLIC_BASE_URL}` + "/api/learn"
  // const url = `${process.env.base_url}` + "/api/learn"
  // const url = "https://noxious-spooky-cauldron-v6rgv6j7xq9hwv6r-3000.app.github.dev/api/learn"
  // console.log(url)
  // console.log("<<<")
  // console.log(layoutData)
  // console.log("<<<")
  console.log("user start")
  console.log(user)
  console.log("user end ")





  // const router = useRouter();
  // console.log(router)


  const pathname = usePathname();
  console.log(pathname)
  // const category = router.query.category;

  // const searchParams = useSearchParams();
  // console.log(searchParams)
  // const queryParamValue = searchParams.get('name');
  // console.log(queryParamValue)

  const fetchInterviewers = useCallback(async (search: string = "") => {

    setIsLoading(true)
    setError(null)
    try {
      // search="A";
      // const response = await axios.get<Interviewer[]>(url, {
      //   params: { 'search': "A" }
      // })
      // console.log("fetchInterviewers " + url)
      const response = await axios.get("/api/learn", {
        params: { 'search': search }
      })
      setInterviewers(response.data.mockInterviewers)
      console.log(response)
    } catch (err) {
      console.error("Error fetching interviewers:", err)
      setError("Failed to fetch interviewers. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // console.log("MMMM")
    // // console.log(layoutData)
    // console.log("MMMM")
    fetchInterviewers()
  }, [fetchInterviewers])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    fetchInterviewers(value)
  }

  return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Interviewer List</h1>
          <Button asChild>
            <Link href="/registrater">Register as Interviewer</Link>
          </Button>
        </div>
        {/*<div>{layoutData}</div>*/}
        {/*<h1 className="text-3xl font-bold mb-6">Interviewer List</h1>*/}
        {/*<Button asChild>*/}
        {/*  <Link href="/register-interviewer">Register as Interviewer</Link>*/}
        {/*</Button>*/}


        <div className="relative mb-6">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"/>
          <Input
              type="text"
              placeholder="Search interviewers..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearch}
          />
        </div>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
        )}

        {isLoading ? (
            <LoadingSkeleton/>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviewers.map((interviewer) => (
                  <Link href={`/interviewer/${interviewer.id}`} key={interviewer.id} className="block">
                    <Card className="h-full transition-shadow hover:shadow-lg">
                      <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar>
                          <AvatarImage src={interviewer.avatar} alt={interviewer.name}/>
                          <AvatarFallback>{interviewer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>{interviewer.name}</CardTitle>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current"/>
                            <span className="ml-1 text-sm text-gray-600">{interviewer.rating?.toFixed(1)}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Expertise: {interviewer.expertise}</p>
                        <p className="text-sm text-gray-600">Experience: {interviewer.experience}</p>
                        <p className="text-sm font-semibold text-primary mt-2">Price: ${interviewer.price}/hour</p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">View Profile</Button>
                      </CardFooter>
                    </Card>
                  </Link>
              ))}
            </div>
        )}
        {/* 底部bar */}
        {/* <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-gray-200 py-2">
        <div className="container mx-auto flex justify-around items-center">
          <Link href="/interviewerList" className="flex flex-col items-center text-sm text-gray-600 hover:text-primary">
            <Home className="h-6 w-6" />
            <span>Home</span>
          </Link>
          <Link href="/interviewers" className="flex flex-col items-center text-sm text-primary">
            <Users className="h-6 w-6" />
            <span>Interviewers</span>
          </Link>
          <Link href="/messages" className="flex flex-col items-center text-sm text-gray-600 hover:text-primary">
            <MessageSquare className="h-6 w-6" />
            <span>Messages</span>
          </Link>
          <Link href="/jobSeekerProfile" className="flex flex-col items-center text-sm text-gray-600 hover:text-primary">
            <User className="h-6 w-6" />
            <span>Profile</span>
          </Link>
        </div>
      </nav> */}

      </div>
  )
}

function LoadingSkeleton() {
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-4 w-[200px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-[250px] mb-2" />
            <Skeleton className="h-4 w-[200px] mb-2" />
            <Skeleton className="h-4 w-[150px]" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}