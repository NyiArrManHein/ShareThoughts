"use client";

import React, { useEffect, useState } from "react";

function Verify({ params }: { params: { token: string } }) {
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    fetch("/api/users/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: params.token }),
    }).then((res) =>
      res.json().then((data) => {
        console.log(isVerified);
        if (data?.isVerified) {
          setIsVerified(true);
          setIsSubmitting(false);
        } else {
          setIsSubmitting(false);
        }
      })
    );
  }, []);
  return (
    <div>
      {isSubmitting ? (
        <>
          <p>Verifying ...</p>
        </>
      ) : (
        <>
          {isVerified ? (
            <p className="text-success">Verified successfully</p>
          ) : (
            <p className="text-error">The token is expired</p>
          )}
          <a href="/">Start Using</a>
        </>
      )}
    </div>
  );
}

export default Verify;
