Initial thoughts are: based on my previous experiences building this type of take-home assessment, I'd like to finish it ASAP to showcase my skills in order to highlight myself among other candidates - I'm pretty sure that everyone's code might achieve similar results given the time window (7 days) to submit a solution, so knowing how to prioritize the right things and submit the project while accomplishing all of its requirements seems the best strategy here. Given that, I intend to follow the instructions about the FE on leveraging MUI kits. I'll also follow the recommendation to use NestJS to develop my backend because, even though I don't have experience with this framework itself, I was happy to read about it quickly and see that it's a really nice, opinionated setup, so that might help save time while also striving to achieve all of the demands from the Dynamox team.

Explained my strategy, I think the best way to start all of this is to think in terms of the **resources** I'll be manipulating and, from there, first develop the API so I can focus in the FE afterwards with everything already cleared.

For starters, there's **user** that should be the faster one. I won't do a full CRUD since it's not required, I'll focus in creation, login for authentication and sending an JWT for authorization.

Besides that, based on the structure of the requirements, I'll assume that we have two main entities that will translate to separate routes in the API: **machines** and **monitoring points**. There's a third resource, **sensors**, that I'll assume they are created from the beginning of the application given the use of the verb _associate_ in the requirements - I understand they are fixed resources with unique ID that can be extended afterwards if needed. I'll attach now an relations diagram created with AI to make visualization easier about these entities:

![Relations Table](/assets/image.png).

<hr>

## Live thoughts

I just realized that we should optimize the models a bit and include userId also in the Monitoring Points since we'll have a dedicated view for this resource. With this, we don't have to query the database for the machines that a user has and, afterwards, search for its monitoring points - that would be a unnecessary, wasted effort.

Another reminder for myself: when updating the machine type, I need to perform checks if the sensor associated is allowed.

To setup the frontend project it took me a while to figure out how to start a Next application and use the Devias template provided by MUI. After some time, I was able to import it using the nx import script (I also had to switch to pnpm in order to make it work). After that, it has been a matter of managing through the template, removing things that I won't use, and leveraging as best as I can all of the components provided by MUI.

While I do think I could improve, for instance, the setup for authentication provided by the boilerplate, which sets up a localStorage token, I did think it was a perfect starting point to just focus on delivering the application. It has the necessary tools to managing the expectations from the Dynamox team.

Another thing that I'll make a decision on my own is to leverage Redux Toolkit Query for managing this application, since it's a newly addition to the Redux ecosystem that I think that simplifies greatly the async side effects management. Given that the original fullstack challenge was written a year ago, I do think this is the best route to take: I can showcase I keep up with new things and I can implement then quickly.

I'm nearly at the deadline and I managed to sync all of the resources with their appropriate API endpoints. Now it's a matter of creating the paginated table with sensors. The good news is that I'll be able to submit the project until end of the day :)
