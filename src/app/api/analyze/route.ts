import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(request: NextRequest) {
  try {
    const { image, environment, customPrompt, artworkDimensions, includePedestal, viewingAngle, lighting, artworkType, aspectRatio } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Create dimension description from user input
    const createDimensionDescription = (dimensions: any) => {
      if (!dimensions.width || !dimensions.height) {
        return artworkType === 'sculpture' ? 'small sculpture of 25 centimeters high' : 'medium-sized artwork'
      }
      
      const unit = dimensions.unit === 'inches' ? 'inches' : 'centimeters'
      const unitShort = dimensions.unit === 'inches' ? 'inch' : 'cm'
      
      if (artworkType === 'sculpture') {
        const depthText = dimensions.depth ? ` by ${dimensions.depth} ${unitShort} deep` : ''
        return `sculpture of ${dimensions.width} ${unitShort} wide by ${dimensions.height} ${unitShort} high${depthText}`
      } else {
        return `painting of ${dimensions.width} by ${dimensions.height} ${unit}`
      }
    }

    const dimensionDescription = createDimensionDescription(artworkDimensions)

    // Define lighting descriptions
    const lightingDescriptions = {
      'well-lit': 'bright, well-lit with even lighting',
      'soft-ambient': 'soft ambient lighting with warm tones',
      'dramatic-spotlight': 'dramatic spotlight with focused lighting and shadows'
    }

    const lightingDescription = lightingDescriptions[lighting as keyof typeof lightingDescriptions] || lightingDescriptions['well-lit']

    // Define room dimensions for realistic scaling
    const getRoomDimensions = (environment: string) => {
      const roomSpecs: { [key: string]: string } = {
        'living-room': 'room of 3 meter high and 5 by 4 meters wide',
        'office': 'office space of 2.8 meter high and 4 by 3 meters wide',
        'gallery': 'contemporary art gallery of 3.5 meter high and 8 by 6 meters wide',
        'concrete-gallery': 'concrete gallery space of 4 meter high and 10 by 8 meters wide',
        'bedroom': 'bedroom of 2.8 meter high and 4 by 3.5 meters wide',
        'restaurant': 'restaurant space of 3 meter high and 6 by 5 meters wide',
        'hotel-lobby': 'hotel lobby of 4 meter high and 8 by 6 meters wide',
        'custom': 'interior space of 3 meter high and 5 by 4 meters wide'
      }
      return roomSpecs[environment] || roomSpecs['living-room']
    }

    const roomDimensions = getRoomDimensions(environment)

    // Create placement description based on pedestal option
    const getPlacementDescription = (environment: string) => {
      if (artworkType !== 'sculpture') return ''
      
      if (includePedestal) {
        return environment === 'gallery' || environment === 'concrete-gallery' 
          ? 'on a pedestal of 50 cm' 
          : 'on a pedestal'
      } else {
        const directPlacements: { [key: string]: string } = {
          'living-room': 'on a coffee table, side table, or floor',
          'office': 'on a desk, shelf, or cabinet',
          'gallery': 'directly on the floor with proper spacing',
          'concrete-gallery': 'directly on the concrete floor',
          'bedroom': 'on a nightstand, dresser, or shelf',
          'restaurant': 'on a table, bar, or shelf',
          'hotel-lobby': 'on a reception desk, side table, or floor',
          'custom': 'on an appropriate surface'
        }
        return directPlacements[environment] || 'on an appropriate surface'
      }
    }

    // Create viewing angle description
    const getViewingAngleDescription = () => {
      const angleDescriptions: { [key: string]: string } = {
        'front': 'viewed straight from the front',
        'angle': 'viewed from a slight angle to show depth and dimension',
        'side': 'viewed from the side to show the profile'
      }
      return angleDescriptions[viewingAngle] || angleDescriptions['front']
    }

    const viewingAngleDescription = getViewingAngleDescription()

    // Create professional photography prompt based on your improved examples
    const createProfessionalPrompt = (environment: string) => {
      // Get camera angle based on viewing angle selection
      const getCameraAngle = () => {
        const angles: { [key: string]: string } = {
          'front': 'Camera positioned directly in front of the artwork',
          'angle': 'Camera positioned at a 30-degree side angle to the artwork',
          'side': 'Camera positioned at a 90-degree side angle to the artwork'
        }
        return angles[viewingAngle] || angles['angle']
      }

      const cameraAngle = getCameraAngle()

      if (artworkType === 'sculpture') {
        // Professional sculpture photography prompt
        const placementText = getPlacementDescription(environment) || 'on a pedestal'
        
        return `Professional gallery photography: A single contemporary ${dimensionDescription} ${placementText} in a spacious modern ${environment === 'gallery' ? 'art gallery' : environment.replace('-', ' ')}. ${cameraAngle}, showing both the artwork and the ${environment.replace('-', ' ')} space perspective. ${environment === 'gallery' ? 'Gallery' : 'Space'} dimensions: ${roomDimensions} with ${environment.includes('gallery') ? 'white walls and polished concrete floors' : 'appropriate interior design'}. The sculpture positioned with proper spacing (minimum 2.5m from walls and other objects). Professional ${lightingDescription} creating subtle shadows that enhance the sculpture's form. Sharp focus on artwork maintaining original materials, textures, and colors. Clean, minimalist composition with no other artworks visible. Shot with professional camera equipment, architectural photography style, wide-angle lens to capture space depth while keeping sculpture accurately scaled to human proportions.`
      } else {
        // Professional painting photography prompt
        return `Professional gallery photography: A single ${dimensionDescription} mounted on a wall in a spacious modern ${environment === 'gallery' ? 'art gallery' : environment.replace('-', ' ')}. ${cameraAngle}, showing both the painting and the ${environment.replace('-', ' ')} space perspective. ${environment === 'gallery' ? 'Gallery' : 'Space'} dimensions: ${roomDimensions} with ${environment.includes('gallery') ? 'white walls and polished concrete floors' : 'appropriate interior design'}. The painting should appear proportionally correct at human eye level (1.5m from floor), with standard spacing (minimum 2m from corners). Professional ${lightingDescription} with even, shadow-free illumination. Sharp focus on artwork maintaining original colors and textures. Clean, minimalist composition with no other artworks visible. Shot with professional camera equipment, architectural photography style, wide-angle lens to capture space depth while keeping artwork accurately scaled.`
      }
    }

    // Define environment prompts using professional photography approach
    const environmentPrompts: { [key: string]: string } = {
      'living-room': createProfessionalPrompt('living-room'),
      'office': createProfessionalPrompt('office'),
      'gallery': createProfessionalPrompt('gallery'),
      'concrete-gallery': createProfessionalPrompt('concrete-gallery'),
      'bedroom': createProfessionalPrompt('bedroom'),
      'restaurant': createProfessionalPrompt('restaurant'),
      'hotel-lobby': createProfessionalPrompt('hotel-lobby'),
      'custom': customPrompt || createProfessionalPrompt('custom')
    }

    const selectedPrompt = environmentPrompts[environment as keyof typeof environmentPrompts] || environmentPrompts['living-room']

    // Call Flux Kontext Pro via Replicate
    const output = await replicate.run(
      "black-forest-labs/flux-kontext-pro",
      {
        input: {
          input_image: image,
          prompt: selectedPrompt,
          output_format: "png",
          output_quality: 100,
          aspect_ratio: aspectRatio || "16:9"
        }
      }
    )

    console.log('Replicate output:', output)

    // Handle the output - Flux Kontext Pro returns a ReadableStream
    let imageUrl: string
    
    if (output instanceof ReadableStream) {
      // Convert ReadableStream to buffer, then to base64 data URL
      const reader = output.getReader()
      const chunks: Uint8Array[] = []
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
      }
      
      // Combine all chunks into a single buffer
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
      const buffer = new Uint8Array(totalLength)
      let offset = 0
      
      for (const chunk of chunks) {
        buffer.set(chunk, offset)
        offset += chunk.length
      }
      
      // Convert to base64 data URL
      const base64 = Buffer.from(buffer).toString('base64')
      imageUrl = `data:image/png;base64,${base64}`
    } else if (typeof output === 'string') {
      imageUrl = output
    } else if (Array.isArray(output) && output.length > 0) {
      imageUrl = output[0]
    } else if (output && typeof output === 'object' && 'url' in output) {
      imageUrl = (output as any).url
    } else {
      throw new Error('Unexpected output format from Replicate')
    }

    // Return the generated image URL
    return NextResponse.json({
      success: true,
      image_url: imageUrl,
      environment: environment,
      prompt_used: selectedPrompt
    })

  } catch (error) {
    console.error('Placement error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to place artwork in environment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Helper functions to extract specific information from AI response
function extractSection(text: string, keyword: string): string | null {
  const regex = new RegExp(`${keyword}[:\\s]*(.*?)(?=\\n\\n|\\d\\.|$)`, 'is')
  const match = text.match(regex)
  return match ? match[1].trim() : null
}

function extractPeriod(text: string): string | null {
  const periodRegex = /(\d{2,4}[-–]\d{2,4}|\d{1,2}th century|renaissance|baroque|impressionism|post-impressionism|modernism|contemporary)/i
  const match = text.match(periodRegex)
  return match ? match[0] : null
}

function extractMovement(text: string): string | null {
  const movements = [
    'Renaissance', 'Baroque', 'Rococo', 'Neoclassicism', 'Romanticism',
    'Realism', 'Impressionism', 'Post-Impressionism', 'Expressionism',
    'Cubism', 'Surrealism', 'Abstract Expressionism', 'Pop Art',
    'Minimalism', 'Contemporary Art'
  ]
  
  for (const movement of movements) {
    if (text.toLowerCase().includes(movement.toLowerCase())) {
      return movement
    }
  }
  return null
}
