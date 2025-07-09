import useAuthStore from '@/store/auth.store';
import { CreateUserPrams, HerbalRecommendation, ReccomendationParams, SignInParams } from '@/type';
import { parseRecommendation } from '@/utils/recomendations';
import {Account, Avatars, Client, Databases, ID, Query} from 'react-native-appwrite'

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    platform: "com.crown.smartpharma", 
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: '686c0fe60000aebacaea',
    userCollectionId: '686c10240013756c46dc',
    recommendationsCollectionId: '686d4e810008572ad031'
}

export const client = new Client()

client
    .setEndpoint(appwriteConfig.endpoint!)
    .setProject(appwriteConfig.projectId!)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
const avatars = new Avatars(client)

export const createUser = async({name, email, password} : CreateUserPrams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name)

        if (!newAccount) throw new Error

        await signIn ({email, password})

        const avatarUrl = avatars.getInitialsURL(name);

        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
             {
              email, name, accountId: newAccount.$id, avatar: avatarUrl
                 
            }
        )

        
    } catch (error) {
        throw new Error(error as string)
    }
}

export const signIn = async ({email, password}: SignInParams ) => {
    try {
        const Session = await account.createEmailPasswordSession(email, password)
    } catch (error) {
        throw new Error(error as string)
    }
} 


export const getCurrentUser= async() => {
    try {
        const currentAccount = await account.get()
        if(!currentAccount) throw Error

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0]
    } catch (error) {
        console.log(error)
        throw new Error(error as string)
    }
}

export const saveRecommendations = async ({
  userId,
  symptoms,
  customSymptoms,
  recommendations,
}: ReccomendationParams) => {

    return await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.recommendationsCollectionId,
        ID.unique(),
        {
            userId,
            symptoms,
            customSymptoms,
            recommendations,
            createdAt: new Date().toISOString(),
        }
    )

}

export async function fetchUserRecommendations(userId: string) {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.recommendationsCollectionId,
      [Query.equal('userId', userId)]
    );

    const formatted = response.documents.map((doc) => {
      

      return {
        id: doc.$id,
        symptoms: doc.symptoms,
        customSymptoms: doc.customSymptoms,
        createdAt: doc.createdAt,
        recommendation: JSON.parse(doc.recommendations) as HerbalRecommendation[],
      };
    });

    return formatted;
  } catch (error) {
    console.error('❌ Error fetching recommendations:', error);
    return [];
  }
}