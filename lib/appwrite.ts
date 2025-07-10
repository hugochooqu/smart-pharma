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
    recommendationsCollectionId: '686d4e810008572ad031',
    remindersId: '686e985400089d01b766',
    medicationId: '686e99d20004d92c7c4f',
    intakeLogId: '686ebbcd000c40fc8705'
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

export const updateUserProfile = async ({
  userId,
  name,
  age,
  weight,
  height,
  avatar,
}: {
  userId: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  avatar: string | null;
}) => {
//   let avatarUrl = avatar;

  // upload if it's a local file (not a URL)
//   if (avatar && avatar.startsWith("file://")) {
//     const file = await fetch(avatar);
//     const blob = await file.blob();
//     const uploaded = await storage.createFile(
//       appwriteConfig.bucketId,
//       ID.unique(),
//       blob
//     );
//     avatarUrl = storage.getFileView(appwriteConfig.bucketId, uploaded.$id).href;
//   }

  await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    userId,
    {
      name,
      age,
      weight,
      height,
      avatar
    }
  );
};

export const saveReminder = async ({
  userId,
  recommendationId,
  note,
  frequencyPerDay,
  times,
  durationDays,
  startDate,
}: {
  userId: string;
  recommendationId: string;
  note: string;
  frequencyPerDay: number;
  times: string[];
  durationDays: number;
  startDate: Date;
}) => {
  return await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.remindersId,
    ID.unique(),
    {
      userId,
      recommendationId,
      note,
      frequencyPerDay,
      times,
      durationDays,
      startDate,
      active: true,
    }
  );
};

export const logMedicationTaken = async ({
  userId,
  recommendationId,
  note = '',
}: {
  userId: string;
  recommendationId: string;
  note?: string;
}) => {
  return await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.medicationId,
    ID.unique(),
    {
      userId,
      recommendationId,
      timestamp: new Date().toISOString(),
      note,
    }
  );
};

export const fetchRemindersForRecommendation = async (
  userId: string,
  
) => {
  const response = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.remindersId,
    [
      Query.equal('userId', userId),
    ]
  );

  return response.documents ;
};


export const saveIntakeLog = async ({
  userId,
  reminderId,
  recommendationId,
  timeIndex
}: {
  userId: string;
  reminderId: string;
  recommendationId: string;
  timeIndex: number;
}) => {
  return await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.intakeLogId, // collection
    ID.unique(),
    {
      userId,
      reminderId,
      recommendationId,
      takenAt: new Date().toISOString(),
      timeIndex
    }
  );
};

export const fetchIntakeLogs = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.intakeLogId, // your collectionId
      [Query.equal("userId", userId)]
    );
    return response.documents;
  } catch (error) {
    console.error("❌ Failed to fetch intake logs:", error);
    return [];
  }
};

export const fetchActiveReminders = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.remindersId,
      [Query.equal("userId", userId)]
    );

    const today = new Date();

    const activeReminders = response.documents.filter((reminder: any) => {
      const start = new Date(reminder.startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + Number(reminder.durationDays));

      return today >= start && today <= end;
    });

    return activeReminders;
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return [];
  }
};
