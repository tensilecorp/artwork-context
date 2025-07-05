import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

export async function POST(request: NextRequest) {
  try {
    console.log('=== UPSCALE API CALLED ===')
    
    const { imageUrl } = await request.json()
    console.log('Received imageUrl:', imageUrl)

    if (!imageUrl) {
      console.log('ERROR: No image URL provided')
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    // Check if Replicate token exists
    if (!process.env.REPLICATE_API_TOKEN) {
      console.log('ERROR: REPLICATE_API_TOKEN not found')
      return NextResponse.json(
        { error: 'Replicate API token not configured' },
        { status: 500 }
      )
    }

    console.log('Starting image upscaling with Topaz Labs...')
    console.log('Using model: topazlabs/image-upscale')
    console.log('Parameters:', {
      image: imageUrl,
      enhance_model: "Standard V2",
      upscale_factor: "2x",
      output_format: "jpg",
      subject_detection: "None",
      face_enhancement: false,
      face_enhancement_creativity: 0,
      face_enhancement_strength: 0.8
    })

    // Run the Topaz Labs image upscale model
    const output = await replicate.run(
      "topazlabs/image-upscale",
      {
        input: {
          image: imageUrl,
          enhance_model: "Standard V2",
          upscale_factor: "2x",
          output_format: "jpg",
          subject_detection: "None",
          face_enhancement: false,
          face_enhancement_creativity: 0,
          face_enhancement_strength: 0.8
        }
      }
    )

    console.log('Upscaling completed successfully!')
    console.log('Output type:', typeof output)
    console.log('Output value:', output)

    // Handle the output - Replicate returns a FileOutput object
    let imageUrl_result
    
    if (output && typeof output === 'object') {
      console.log('Output is an object, checking for URL...')
      
      // Check if it has a url() method (FileOutput)
      if (typeof (output as any).url === 'function') {
        imageUrl_result = (output as any).url()
        console.log('Got URL from output.url():', imageUrl_result)
      } else if (output.toString && typeof output.toString === 'function') {
        imageUrl_result = output.toString()
        console.log('Got URL from output.toString():', imageUrl_result)
      } else {
        console.log('Output object properties:', Object.keys(output))
        throw new Error('Cannot extract URL from output object')
      }
    } else if (typeof output === 'string') {
      // Direct URL string
      imageUrl_result = output
      console.log('Output is direct URL string:', imageUrl_result)
    } else {
      console.log('Unexpected output format:', output)
      throw new Error('Unexpected output format from Topaz Labs')
    }

    console.log('Final image URL:', imageUrl_result)

    return NextResponse.json({
      success: true,
      upscaled_image_url: imageUrl_result,
      original_image_url: imageUrl,
      scale_factor: 2
    })

  } catch (error) {
    console.error('=== UPSCALING ERROR ===')
    console.error('Error:', error)
    console.error('Error type:', typeof error)
    console.error('Error constructor:', error?.constructor?.name)
    
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    // More detailed error information
    let errorMessage = 'Unknown error'
    let errorDetails = {}
    
    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = {
        name: error.name,
        message: error.message,
        stack: error.stack?.substring(0, 500) // Limit stack trace length
      }
    } else if (typeof error === 'object' && error !== null) {
      errorDetails = error
      errorMessage = JSON.stringify(error)
    }
    
    console.error('Returning error response:', { errorMessage, errorDetails })
    
    return NextResponse.json(
      { 
        error: 'Failed to upscale image',
        message: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    )
  }
}
