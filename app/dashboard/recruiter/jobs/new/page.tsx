'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createJob } from '@/lib/actions/job'
import { TJobData } from '@/types/types'
import { toast } from '@/components/ui/toast'


const jobCategories = [
  'HireLoop Network',
  'Engineering & Tech',
  'Design & Creative',
  'Marketing & Sales',
  'Customer Support',
  'Finance & Accounting',
  'Healthcare',
  'Education & Training',
]

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship']

const salaryFrequencies = ['per hour', 'per day', 'per month', 'per year']

const workModes: Array<TJobData['workMode']> = ['Remote', 'Hybrid', 'On-site']

const inputLabelClass = 'mb-1.5 block text-sm font-medium'
const requiredMark = <span className="text-destructive"> *</span>

const NewJobPage = () => {
  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Easy data collection — all fields (including Select & Checkbox) in one step
    const newFormData= new FormData(event.currentTarget)
   
    const jobData = Object.fromEntries(newFormData.entries()) as TJobData

    console.log('Job form data:', jobData)
    // TODO: send `data` to your jobs API
    const result = await createJob(jobData)
    console.log("submitted data",result)
    if(result.insertedId){
      toast.add({
        title: "Job created successfully!",
        description: `${jobData.title} has been added to your job listings.`,
      })
    }
  }

  return (
    <div className="mx-auto w-full  space-y-6 p-4 md:p-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-semibold">Update Job Post</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Modify position specifications, compensation range, and candidate requirements for this
          listing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>1. Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <Label htmlFor="title" className={inputLabelClass}>
                Job Title{requiredMark}
              </Label>
              <Input id="title" name="title" placeholder="Frontend Developer" required />
            </div>

            <div className="sm:col-span-1">
              <Label htmlFor="companyName" className={inputLabelClass}>
                Company Name{requiredMark}
              </Label>
              <Input id="companyName" name="companyName" placeholder="Acme Inc." required />
            </div>

            <div className="sm:col-span-1">
              <Label className={inputLabelClass}>Job Category{requiredMark}</Label>
              <Select name="jobCategory" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {jobCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-1">
              <Label className={inputLabelClass}>Job Type{requiredMark}</Label>
              <div className="flex flex-wrap gap-2">
                {jobTypes.map((type, index) => (
                  <label
                    key={type}
                    className="has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary flex cursor-pointer items-center gap-1.5 rounded-lg border border-input px-2.5 py-1.5 text-sm transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50"
                  >
                    {/* Native radio → picked up by FormData automatically */}
                    <input
                      type="radio"
                      name="jobType"
                      value={type}
                      defaultChecked={index === 0}
                      className="sr-only"
                      required
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Location, Compensation & Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>2. Location, Compensation &amp; Timeline</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-input p-3 transition-colors hover:bg-muted/50">
                <Checkbox name="isRemote" value="true" className="mt-0.5" />
                <span>
                  <span className="block text-sm font-medium">Remote Work Allowed (isRemote)</span>
                  <span className="block text-xs text-muted-foreground">
                    Enable worldwide or distributed candidate applications
                  </span>
                </span>
              </label>
            </div>

            <div className="sm:col-span-2">
              <Label className={inputLabelClass}>Work Mode{requiredMark}</Label>
              <div className="flex flex-wrap gap-2">
                {workModes.map((mode, index) => (
                  <label
                    key={mode}
                    className="has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary flex cursor-pointer items-center gap-1.5 rounded-lg border border-input px-2.5 py-1.5 text-sm transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50"
                  >
                    {/* Native radio → picked up by FormData automatically */}
                    <input
                      type="radio"
                      name="workMode"
                      value={mode}
                      defaultChecked={index === 0}
                      className="sr-only"
                      required
                    />
                    {mode}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="location" className={inputLabelClass}>
                Job Location (location){requiredMark}
              </Label>
              <Input id="location" name="location" placeholder="New York, USA" required />
            </div>

            <div>
              <Label htmlFor="deadline" className={inputLabelClass}>
                Application Deadline (deadline){requiredMark}
              </Label>
              <Input id="deadline" name="deadline" type="date" required />
            </div>

            <div className="grid grid-cols-3 gap-3 sm:col-span-2">
              <div>
                <Label htmlFor="minSalary" className={inputLabelClass}>
                  Min Salary / Rate
                </Label>
                <Input
                  id="minSalary"
                  name="minSalary"
                  type="number"
                  min="0"
                  placeholder="25"
                />
              </div>
              <div>
                <Label htmlFor="maxSalary" className={inputLabelClass}>
                  Max Salary / Rate
                </Label>
                <Input
                  id="maxSalary"
                  name="maxSalary"
                  type="number"
                  min="0"
                  placeholder="40"
                />
              </div>
              <div>
                <Label className={inputLabelClass}>Frequency</Label>
                <Select name="salaryFrequency" defaultValue="per hour">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {salaryFrequencies.map((frequency) => (
                      <SelectItem key={frequency} value={frequency}>
                        {frequency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Responsibilities & Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>3. Responsibilities &amp; Requirements</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <Label htmlFor="responsibilities" className={inputLabelClass}>
                Key Responsibilities{requiredMark}
              </Label>
              <Textarea
                id="responsibilities"
                name="responsibilities"
                rows={5}
                placeholder="Describe the key responsibilities of this role..."
                required
              />
            </div>

            <div>
              <Label htmlFor="requirements" className={inputLabelClass}>
                Qualifications &amp; Requirements{requiredMark}
              </Label>
              <Textarea
                id="requirements"
                name="requirements"
                rows={5}
                placeholder="• 3+ years of experience with React, TypeScript..."
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Update Job
          </Button>
        </div>
      </form>
    </div>
  )
}

export default NewJobPage
