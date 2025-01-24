import Icon from "../Icon/Icon";

export default function Footer() {
  return (
    <footer className="text-gray-600 body-font w-full border-t border-solid border-black bg-white h-[72px]">
      <div className="container px-5 py-4 mx-auto flex items-center sm:flex-row flex-col">
        <div className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
          <Icon
            name="eye"
            className="w-10 h-10 text-white p-2 bg-blue-500 rounded-full"
          />
          <span className="ml-3 text-xl">XSS - RC</span>
        </div>
        <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
          © 2024 XSS - RC | Developed by
          <a
            href="https://github.com/pr0h0"
            className="text-gray-600 ml-1"
            rel="noopener noreferrer"
            target="_blank"
          >
            @pr0h0
          </a>
        </p>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
          <a
            className="ml-3 text-gray-500"
            href="https://github.com/pr0h0"
            target="_blank"
          >
            <Icon name="github" className="w-5 h-5" />
          </a>
          <a
            className="ml-3 text-gray-500"
            href="https://x.com/pr0h0_me"
            target="_blank"
          >
            <Icon name="twitter" className="w-5 h-5" />
          </a>
          <a
            className="ml-3 text-gray-500"
            href="https://ba.linkedin.com/in/abdulah-proho-4ba886210"
            target="_blank"
          >
            <Icon name="linkedin" className="w-5 h-5" />
          </a>
          <a
            className="ml-3 text-gray-500"
            href="mailto:abdulahproho@gmail.com"
          >
            <Icon name="mail" className="w-5 h-5" />
          </a>
        </span>
      </div>
    </footer>
  );
}
