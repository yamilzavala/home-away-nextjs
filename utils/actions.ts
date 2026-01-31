'use server'
import db from './db';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { imageSchema, profileSchema, propertySchema, validateWithZodSchema } from './schemas';
import { uploadImage } from './supabase';

export const createProfileAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error('Please login to create a profile');

    // data
    const rawData = Object.fromEntries(formData);

    //sanitization
    const validatedFields = validateWithZodSchema(profileSchema, rawData)

    // db
    await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? '',
        firstName: validatedFields.firstName,
        lastName: validatedFields.lastName,
        username: validatedFields.username
      },
    });

    // lib
    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
    });
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
  redirect('/');
};

export const fetchProfileImage = async () => {
  const user = await currentUser();
  if(!user) return null;

  const profile= await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      profileImage: true,
    }
  })

  return profile?.profileImage;
}


const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to access this route');
  }
  if (!user.privateMetadata.hasProfile) redirect('/profile/create');
  return user;
};

export const fetchProfile = async () => {
  const user = await getAuthUser();

  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
  });
  if (!profile) return redirect('/profile/create');
  return profile;
};

const renderError = (error: unknown): { message: string } => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : 'An error occurred',
  };
};

export const updateProfileAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    // data
    const rawData = Object.fromEntries(formData);

    // sanitization
    const validatedFields = validateWithZodSchema(profileSchema, rawData)

    // db 
    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: validatedFields,
    });
    revalidatePath('/profile');
    return { message: 'Profile updated successfully' };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProfileImageAction = async (prevState: any, formData: FormData): Promise<{message: string}> => {
  const user = await getAuthUser()
  try {
    // data
    const image = formData.get('image') as File;

    // sanitization
    const validatedFields = validateWithZodSchema(imageSchema, {image})
    const fullPath = await uploadImage(validatedFields.image)

    // db
    await db.profile.update({
      where: {
        clerkId: user.id
      }, data: {
        profileImage: fullPath
      }
    })
    revalidatePath('/profile')
  } catch (error) {
    return renderError(error)
  }
  
  return { message: 'Profile image updated successfully' }; 
}

export const createPropertyAction = async (prevState: any, formData: FormData): Promise<{message: string}> => {
  const user = await getAuthUser()
  try {
    // data
    const rawData = Object.fromEntries(formData)
    const file = formData.get('image') as File;

    // sanitization
    const validatedFields = validateWithZodSchema(propertySchema, rawData)
    const validatedFile = validateWithZodSchema(imageSchema, {image: file})
    const fullPath = await uploadImage(validatedFile.image)

    // db
    await db.property.create({
      data: {
        ...validatedFields,
        image: fullPath,
        profileId: user.id
      }
    })
  } catch (error) {
    return renderError(error)
  }
  redirect('/')
}

export const fetchProperties = async ({search = '', category}: {search?: string, category?: string}) => {
  const properties = await db.property.findMany({
    where: {
      category, 
      OR: [
        {name: {contains: search, mode: 'insensitive'}},
        {tagline: {contains: search, mode: 'insensitive'}},
      ]
    },
    select: {
      id: true,
      name: true,
      tagline: true,
      country: true,
      image: true,
      price: true,      
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return properties
}