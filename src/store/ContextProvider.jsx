import { useState, useEffect } from "react";
import context from "./context";

import BASE_URL from "../config";

const DatingContextProvider = (props) => {
  const token = sessionStorage.getItem("dateUserToken");
  const [tokenValue, setTokenValue] = useState(token || "");
  const [tokenIsSet, setTokenIsSet] = useState(false);

  const [users, setUsers] = useState([]);
  const [isGettingUsers, setIsGettingUsers] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [pageCount, setPageCount] = useState(1);

  const getUsers = () => {
    if (!tokenValue || tokenValue.trim() === "") {
      console.log("Cannot fetch users: token not set");
      setIsGettingUsers(false);
      return;
    }
    
    setIsGettingUsers(true);
    var newHeader = new Headers();
    newHeader.append("Accept", "application/json");
    newHeader.append("Authorization", `Bearer ${tokenValue}`);

    var requestOptions = {
      method: "GET",
      headers: newHeader,
      redirect: "follow",
    };

    fetch(BASE_URL + "/api/fetch-users?page=" + pageCount, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setIsGettingUsers(false);
        console.log(result);
        if (result.success && Array.isArray(result.users)) {
          setHasNextPage(result.has_next_page || false);
          if (result.has_next_page) {
            setPageCount((prevCount) => {
              return prevCount + 1;
            });
          }
          setUsers((prevUsers) => {
            return [...prevUsers, ...(result.users || [])];
          });
        } else if (result.error) {
          console.log("Error:", result.error);
        }
      })
      .catch((error) => {
        setIsGettingUsers(false);
        console.log("error", error);
      });
  };

  useEffect(() => {
    if (tokenValue && users.length === 6 && hasNextPage) {
      getUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  const [matches, setMatches] = useState([]);
  const [gettingMatches, setGettingMatches] = useState(false);

  const getMatches = () => {
    if (!tokenValue || tokenValue.trim() === "") {
      console.log("Cannot fetch matches: token not set");
      setGettingMatches(false);
      return;
    }
    
    setGettingMatches(true);
    var newHeader = new Headers();
    newHeader.append("Accept", "application/json");
    newHeader.append("Authorization", `Bearer ${tokenValue}`);

    var requestOptions = {
      method: "GET",
      headers: newHeader,
      redirect: "follow",
    };

    fetch(BASE_URL + "/api/matches", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setGettingMatches(false);
        if (result.success && Array.isArray(result.matches)) {
          setMatches(result.matches);
        } else if (result.error) {
          console.log("Error getting matches:", result.error);
        }
      })
      .catch((error) => {
        setGettingMatches(false);
        console.log("error", error);
      });
  };

  const [profile, setProfile] = useState({ gender: { id: 1 } });

  const [isGettingProfile, setIsGettingProfile] = useState(false);

  const getProfile = () => {
    if (!tokenValue || tokenValue.trim() === "") {
      console.log("Cannot fetch profile: token not set");
      setIsGettingProfile(false);
      return;
    }
    
    setIsGettingProfile(true);
    var newHeader = new Headers();
    newHeader.append("Accept", "application/json");
    newHeader.append("Authorization", `Bearer ${tokenValue}`);

    var requestOptions = {
      method: "GET",
      headers: newHeader,
      redirect: "follow",
    };

    fetch(BASE_URL + "/api/profile", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setIsGettingProfile(false);
        if (result.success && result.user) {
          setProfile(result.user);
          console.log(result);
        } else if (result.error) {
          console.log("Error getting profile:", result.error);
        }
      })
      .catch((error) => {
        setIsGettingProfile(false);
        console.log("error", error);
      });
  };

  useEffect(() => {
    if (tokenValue) {
      getProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenValue]);

  const unmatchUser = (confirmation, id) => {
    console.log(confirmation, "confirmed");
    if (!tokenValue || tokenValue.trim() === "") {
      console.log("Cannot unmatch: token not set");
      return;
    }
    
    if (confirmation) {
      var newHeader = new Headers();
      newHeader.append("Accept", "application/json");
      newHeader.append("Content-Type", "application/json");
      newHeader.append("Authorization", `Bearer ${tokenValue}`);

      var raw = JSON.stringify({
        match_id: id,
      });

      var requestOptions = {
        method: "POST",
        headers: newHeader,
        body: raw,
        redirect: "follow",
      };

      fetch(BASE_URL + "/api/unmatch", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.success) {
            // Remove from matches list
            setMatches(matches.filter(m => m.id !== id));
          }
        })
        .catch((error) => console.log("error", error));
    }
  };

  const value = {
    tokenValue,
    tokenIsSet,
    setTokenIsSet,
    setTokenValue,
    isGettingUsers,
    users,
    setUsers,
    getUsers,
    gettingMatches,
    matches,
    setMatches,
    getMatches,
    isGettingProfile,
    profile,
    setProfile,
    getProfile,
    unmatchUser,
  };

  return <context.Provider value={value}>{props.children}</context.Provider>;
};

export default DatingContextProvider;
