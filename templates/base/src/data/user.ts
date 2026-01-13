export const usersList = [
  {
    id: "68527d9df6fd0f5b8abb6832",
    name: "Ana Funk",
    email: "ana.funksds@mailinator.com",
    status: 0,
    address: "New York",
    children: [
      {
        id: "68527d9df6fd0f5b8abb68324534",
        name: "Ana Funk",
        email: "ana.funkfdsfsdfdtest1@mailinator.com",
        status: 0,
        children: [
          {
            id: "68527d9df6fd0f5b8abb6832423432",
            name: "Test one",
            email: "test.oneesdkfjkdsj@mailinator.com",
            status: 0,
            children: [
              {
                id: "68527d9df6fd0f5b8abb683245ipoo34",
                name: "Test two",
                email: "test.twosdkfjkdsjsdfld@mailinator.com",
                status: 0,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "68526f74fb12d52b17ffc92d",
    name: "James Miller",
    email: "james@mailinator.com",
    status: 1,
    address: "Los Angeles",
    children: [],
  },

  {
    id: "684179ffdbf34bee964fe4554543",
    name: "Suraj Sahu",
    email: "surajsahu@mailinator.com",
    status: 1,
    address: "Chicago",
    children: [
      {
        id: "684179ffdbf34bee964fe4554543",
        name: "Suraj Sahu",
        email: "surajsahudsds@mailinator.com",
        children: [
          {
            id: "684179ffdbf34bee964fe8974385",
            name: "Test three",
            email: "test.threesdkfjkdsj@mailinator.com",
            status: 0,
          },
          {
            id: "684179ffdbf34bee964fh495495893",
            createdAt: "2025-06-18T08:49:33.584Z",
            updatedAt: "2025-06-18T08:49:33.584Z",
          },
        ],
      },
    ],
  },
] as const;
