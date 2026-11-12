'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { useRouter } from 'next/navigation'
import {
  INITIAL_JOB_DATA,
  JOB_CATEGORIES,
  JOB_STATUSES,
  JOB_TYPES,
  SALARY_FREQUENCIES,
  WORK_MODES,
} from '@/lib/constants'
import { chipLabelClass, inputLabelClass, pageContainerClass } from '@/lib/styles'

const requiredMark = <span className="text-destructive"> *</span>

const NewJobPage = () => {
  // Whole form lives in one state object — every field is controlled
  const [jobData, setJobData] = useState<TJobData>(INITIAL_JOB_DATA)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Generic field setter, keeps numbers as real numbers
  const setField = <K extends keyof TJobData>(key: K, value: TJobData[K]) => {
    setJobData((prev) => ({ ...prev, [key]: value }))
  }

  // One onChange handler for all text & number inputs/textareas
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, type, value } = event.target
    setJobData((prev) => ({
      ...prev,
      // number inputs come through as strings → convert them here
      [name]: type === 'number' ? Number(value) || 0 : value,
    }))
  }

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      // jobData is already collected & typed via useState — no FormData needed
      console.log('Job form data:', jobData)
      const result = await createJob(jobData)
      console.log("submitted data",result)
      if(result.insertedId){
        toast.add({
          title: "Job created successfully!",
          description: `${jobData.title} has been added to your job listings.`,
        })
        setJobData(INITIAL_JOB_DATA) // reset the form
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to create job:', error)
      toast.add({
        title: "Failed to create job",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={pageContainerClass}>
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-semibold">Create Job Post</h2>
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
              <Input
                id="title"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                placeholder="Frontend Developer"
                required
              />
            </div>

            <div className="sm:col-span-1">
              <Label htmlFor="companyName" className={inputLabelClass}>
                Company Name{requiredMark}
              </Label>
              <Input
                id="companyName"
                name="companyName"
                value={jobData.companyName}
                onChange={handleChange}
                placeholder="Acme Inc."
                required
              />
            </div>

            <div className="sm:col-span-1">
              <Label className={inputLabelClass}>Job Category{requiredMark}</Label>
              <Select
                value={jobData.jobCategory}
                onValueChange={(value) => setField('jobCategory', value as string)}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_CATEGORIES.map((category) => (
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
                {JOB_TYPES.map((type) => (
                  <label key={type} className={chipLabelClass}>
                    <input
                      type="radio"
                      name="jobType"
                      value={type}
                      checked={jobData.jobType === type}
                      onChange={(event) =>
                        setField('jobType', event.target.value as TJobData['jobType'])
                      }
                      className="sr-only"
                      required
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className="sm:col-span-1">
              <Label className={inputLabelClass}>Status{requiredMark}</Label>
              <Select
                value={jobData.status}
                onValueChange={(value) => setField('status', value as TJobData['status'])}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label className={inputLabelClass}>Work Mode{requiredMark}</Label>
              <div className="flex flex-wrap gap-2">
                {WORK_MODES.map((mode) => (
                  <label key={mode} className={chipLabelClass}>
                    <input
                      type="radio"
                      name="workMode"
                      value={mode}
                      checked={jobData.workMode === mode}
                      onChange={(event) =>
                        setField('workMode', event.target.value as TJobData['workMode'])
                      }
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
              <Input
                id="location"
                name="location"
                value={jobData.location}
                onChange={handleChange}
                placeholder="New York, USA"
                required
              />
            </div>

            <div>
              <Label htmlFor="deadline" className={inputLabelClass}>
                Application Deadline (deadline){requiredMark}
              </Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={jobData.deadline}
                onChange={handleChange}
                required
              />
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
                  value={jobData.minSalary}
                  onChange={handleChange}
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
                  value={jobData.maxSalary}
                  onChange={handleChange}
                  placeholder="40"
                />
              </div>
              <div>
                <Label className={inputLabelClass}>Frequency</Label>
                <Select
                  value={jobData.salaryFrequency}
                  onValueChange={(value) =>
                    setField('salaryFrequency', value as TJobData['salaryFrequency'])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SALARY_FREQUENCIES.map((frequency) => (
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
                value={jobData.responsibilities}
                onChange={handleChange}
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
                value={jobData.requirements}
                onChange={handleChange}
                placeholder="• 3+ years of experience with React, TypeScript..."
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Publish Job'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default NewJobPage
