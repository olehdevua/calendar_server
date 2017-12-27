module.exports = function UserController({ logger, models }) {
  const User = models.model("User");
  const Event = models.model("Event");

  return {
    async create(req, resp) {
      try {
        const { email, name, password } = req.body;
        const user = new User({ email, name });
        await user.setPassword(password);
        await user.save().then();
        logger.debug(`user ${email} created`, email);
        resp.status(201).send("");
      } catch (err) {
        let message;
        if (err.errors) {
          const key = Object.keys(err.errors)[0];
          message = err.errors[key].message;
        } else {
          message = err.message;
        }
        logger.debug("create user error: ", message);
        resp.status(400).json({ error: { message } });
      }
    },

    async addEvent(req, resp) {
      try {
        const { title, start, duration } = req.body;
        const user = req.user;

        const event = new Event({ title, start, duration, user: user._id });
        await event.save().then();

        logger.debug(`event ${title} created`, title);
        resp.status(201).send("");
      } catch (err) {
        resp.status(400).json({ error: { message: err.message } });
      }
    }
  };
};
