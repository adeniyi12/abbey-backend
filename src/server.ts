import { App } from "./app";
import { AuthRoute } from "./routes/auth.route";
import { FeedRoute } from "./routes/feed.route";
import { RelationshipRoute } from "./routes/relationship.route";
import { UserRoute } from "./routes/user.route";

const app = new App([new AuthRoute(), new UserRoute(), new RelationshipRoute(), new FeedRoute()]);
app.listen()