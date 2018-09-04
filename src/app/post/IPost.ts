export interface IPost {
    _id: string;
    userName: string;
    name: string;
    email: string;
    mobile: string;
    gender: string;
    dateOfBirth: string;
    isVerified: boolean;
    isDeleted: boolean;
    profile: {
        bio: string;
        image: string;
        experience: [
            {
                designation: string;
                companyName: string;
                timePeriod: string;
            }
        ];
        education: [
            {
                degreeName: string,
                university: string
                percentage: string,
                yearOfPassing: string,
            }
        ],
        accomplishment: {
            certifications: [
                {
                    name: string,
                    issuedBy: string,
                    year: string
                }
            ],
            awards: [
                {
                    name: string,
                    awardedBy: string,
                    year: string,
                }
            ],
            publications: [
                {
                    name: string,
                    topic: string,
                    publishedBy: string,
                    year: string
                }
            ]
        },
        skills: string[],
        endorsements: [
            {
                endorsedBy: string,
                comment: string,
            }
        ]
    },
    posts: [
        {
            postId: string,
            content: string,
            //postImage: '(file)',
            timestamp: string,
            likes: [
                {
                    likedBy: string,
                    timestamp: string
                }
            ],
            comments: [
                {
                    commentBy: string,
                    content: string,
                    timestamp: string
                }
            ]
        }
    ],
    blocklist: {
        blocked: string[],
        blockedBy: string[],
    },
    connectionRequests: {
        sent: string[],
        receive: string[]
    },
    connections: string[],
    followingCompany: string[]

}

